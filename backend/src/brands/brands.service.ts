import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema.js';
import { Product, ProductDocument } from '../products/schemas/product.schema.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';
import { UpdateBrandDto } from './dto/update-brand.dto.js';
import { slugify } from '../common/slugify.js';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  create(dto: CreateBrandDto) {
    return this.brandModel.create({ name: dto.name, slug: slugify(dto.name) });
  }

  findAll() {
    return this.brandModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) throw new NotFoundException('Бренд не знайдено');
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.brandModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!brand) throw new NotFoundException('Бренд не знайдено');
    return brand;
  }

  async remove(id: string) {
    const productsCount = await this.productModel.countDocuments({ brand: id }).exec();
    if (productsCount > 0) {
      throw new BadRequestException(
        `Неможливо видалити бренд: з ним повʼязано товарів — ${productsCount}. Спочатку приберіть бренд у цих товарах.`,
      );
    }

    const brand = await this.brandModel.findByIdAndDelete(id).exec();
    if (!brand) throw new NotFoundException('Бренд не знайдено');
    return brand;
  }

  async setImage(id: string, image: { url: string; publicId: string }) {
    const brand = await this.brandModel
      .findByIdAndUpdate(
        id,
        { imageUrl: image.url, imagePublicId: image.publicId },
        { new: true },
      )
      .exec();
    if (!brand) throw new NotFoundException('Бренд не знайдено');
    return brand;
  }

  async clearImage(id: string) {
    const brand = await this.brandModel
      .findByIdAndUpdate(
        id,
        { $unset: { imageUrl: '', imagePublicId: '' } },
        { new: true },
      )
      .exec();
    if (!brand) throw new NotFoundException('Бренд не знайдено');
    return brand;
  }
}
