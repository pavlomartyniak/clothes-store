import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { CategoriesService } from '../categories/categories.service.js';
import { BrandsService } from '../brands/brands.service.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { sendAdminMessage } from '../common/telegram-notify.js';

const SITE_URL = 'https://martosoli.com';

/** A single Telegram photo size entry, as sent in channel_post.photo[]. */
type TelegramPhotoSize = { file_id: string; width: number; height: number };

type TelegramChannelPost = {
  message_id: number;
  chat: { id: number };
  text?: string;
  caption?: string;
  photo?: TelegramPhotoSize[];
  media_group_id?: string;
};

type PendingGroup = {
  photoFileIds: string[];
  caption?: string;
  timer: ReturnType<typeof setTimeout>;
};

const MEDIA_GROUP_DEBOUNCE_MS = 2000;

function parseField(text: string, label: string): string | undefined {
  const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, 'im');
  return text.match(re)?.[1]?.trim();
}

function parseDescription(text: string): string | undefined {
  const re = /^Опис\s*:\s*([\s\S]*)$/im;
  return text.match(re)?.[1]?.trim();
}

function parsePrice(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const digits = value.replace(/[^\d]/g, '');
  return digits ? Number(digits) : undefined;
}

function parseSizes(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

@Injectable()
export class TelegramImportService {
  private readonly pendingGroups = new Map<string, PendingGroup>();

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly brandsService: BrandsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  handleChannelPost(post: TelegramChannelPost) {
    const expectedChatId = process.env.TELEGRAM_CHANNEL_ID;
    if (expectedChatId && String(post.chat.id) !== expectedChatId) return;

    const text = post.caption ?? post.text;
    const largestPhoto = post.photo?.at(-1);

    if (post.media_group_id) {
      this.bufferGroupedPost(post.media_group_id, largestPhoto?.file_id, text);
      return;
    }

    if (!text) return; // a lone photo with no caption carries no product data
    const photoFileIds = largestPhoto ? [largestPhoto.file_id] : [];
    void this.importProduct(text, photoFileIds);
  }

  private bufferGroupedPost(groupId: string, photoFileId: string | undefined, caption: string | undefined) {
    const existing = this.pendingGroups.get(groupId);
    if (existing) clearTimeout(existing.timer);

    const photoFileIds = existing?.photoFileIds ?? [];
    if (photoFileId) photoFileIds.push(photoFileId);
    const resolvedCaption = caption ?? existing?.caption;

    const timer = setTimeout(() => {
      this.pendingGroups.delete(groupId);
      if (resolvedCaption) void this.importProduct(resolvedCaption, photoFileIds);
    }, MEDIA_GROUP_DEBOUNCE_MS);

    this.pendingGroups.set(groupId, { photoFileIds, caption: resolvedCaption, timer });
  }

  private async importProduct(text: string, photoFileIds: string[]) {
    try {
      const name = parseField(text, 'Назва');
      const categoryName = parseField(text, 'Категорія');
      const brandName = parseField(text, 'Бренд');
      const price = parsePrice(parseField(text, 'Ціна'));
      const oldPrice = parsePrice(parseField(text, 'Стара ціна'));
      const sizes = parseSizes(parseField(text, 'Розміри'));
      const material = parseField(text, 'Матеріал');
      const description = parseDescription(text) ?? '';

      if (!name) throw new Error('Не вказано "Назва"');
      if (!categoryName) throw new Error('Не вказано "Категорія"');
      if (!price) throw new Error('Не вказано або некоректна "Ціна"');

      const categories = await this.categoriesService.findAll();
      const category = categories.find(
        (c) => c.name.trim().toLowerCase() === categoryName.trim().toLowerCase(),
      );
      if (!category) {
        throw new Error(
          `Категорію "${categoryName}" не знайдено. Наявні: ${categories.map((c) => c.name).join(', ')}`,
        );
      }

      let brandId: string | undefined;
      let brandWarning: string | undefined;
      if (brandName) {
        const brands = await this.brandsService.findAll();
        const brand = brands.find(
          (b) => b.name.trim().toLowerCase() === brandName.trim().toLowerCase(),
        );
        if (brand) brandId = String(brand._id);
        else brandWarning = `Бренд "${brandName}" не знайдено — товар створено без бренду.`;
      }

      const product = await this.productsService.create({
        name,
        category: String(category._id),
        brand: brandId,
        price,
        oldPrice,
        description,
        sizes,
        material,
      });

      for (const fileId of photoFileIds) {
        try {
          const buffer = await this.downloadTelegramFile(fileId);
          const uploaded = await this.cloudinaryService.uploadImage(buffer);
          await this.productsService.addImage(String(product._id), {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
          });
        } catch (err) {
          console.error('Failed to attach Telegram photo to product:', err);
        }
      }

      await sendAdminMessage(
        [
          `✅ Товар створено з каналу: ${name}`,
          `${price} грн`,
          `${SITE_URL}/product/${product.slug}`,
          ...(brandWarning ? ['', `⚠️ ${brandWarning}`] : []),
        ].join('\n'),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Невідома помилка';
      await sendAdminMessage(`❌ Не вдалося створити товар з поста каналу.\n${message}`);
    }
  }

  private async downloadTelegramFile(fileId: string): Promise<Buffer> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN не налаштовано');

    const fileInfoRes = await fetch(
      `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`,
    );
    const fileInfo = (await fileInfoRes.json()) as {
      ok: boolean;
      result?: { file_path: string };
    };
    if (!fileInfo.ok || !fileInfo.result) throw new Error('Не вдалося отримати файл з Telegram');

    const fileRes = await fetch(
      `https://api.telegram.org/file/bot${token}/${fileInfo.result.file_path}`,
    );
    const arrayBuffer = await fileRes.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
