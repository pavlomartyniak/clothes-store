import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

export type ProductFilters = {
  category?: string;
  subcategory?: string;
  search?: string;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  findAll(filters: ProductFilters = {}) {
    const query: QueryFilter<ProductDocument> = {};
    if (filters.category) query.category = filters.category;
    if (filters.subcategory) query.subcategory = filters.subcategory;
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }
    return this.productModel
      .find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('category', 'name slug')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productModel
      .findOne({ slug })
      .populate('category', 'name slug')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('category', 'name slug')
      .exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) throw new NotFoundException('Товар не знайдено');
    return product;
  }
}
