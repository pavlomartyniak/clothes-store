import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Files land in memory (file.buffer) instead of disk — they're forwarded
// straight to Cloudinary and never touch this server's filesystem.
export const imageUploadOptions = {
  storage: memoryStorage(),
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          'Дозволені лише зображення форматів JPEG, PNG, WEBP або GIF',
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
};
