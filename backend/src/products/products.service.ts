import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Product, ProductDocument, ProductImage } from './schemas/product.schema.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { slugify } from '../common/slugify.js';

export type ProductFilters = {
  category?: string;
  subcategory?: string;
  brand?: string;
  search?: string;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    const slug = await this.uniqueSlug(slugify(dto.name));
    return this.productModel.create({ ...dto, slug });
  }

  /** Appends -2, -3, ... until the slug doesn't collide with an existing product. */
  private async uniqueSlug(base: string): Promise<string> {
    let slug = base;
    let suffix = 2;
    while (await this.productModel.exists({ slug })) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }

  findAll(filters: ProductFilters = {}) {
    const query: QueryFilter<ProductDocument> = {};
    if (filters.category) query.category = filters.category;
    if (filters.subcategory) query.subcategory = filters.subcategory;
    if (filters.brand) query.brand = filters.brand;
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }
    return this.productModel
      .find(query)
      .populate('category', 'name slug')
      .populate('brand', 'name slug imageUrl')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category', 'name slug')
      .populate('brand', 'name slug imageUrl')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productModel
      .findOne({ slug })
      .populate('category', 'name slug')
      .populate('brand', 'name slug imageUrl')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug imageUrl')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async addImage(id: string, image: ProductImage) {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $push: { images: image } }, { new: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug imageUrl')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async removeImage(id: string, publicId: string) {
    const product = await this.productModel
      .findByIdAndUpdate(id, { $pull: { images: { publicId } } }, { new: true })
      .populate('category', 'name slug')
      .populate('brand', 'name slug imageUrl')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }
}
