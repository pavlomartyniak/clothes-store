import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema.js';
import { Product, ProductDocument } from '../products/schemas/product.schema.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { SubcategoryDto } from './dto/subcategory.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  create(dto: CreateCategoryDto) {
    return this.categoryModel.create(dto);
  }

  findAll() {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) throw new NotFoundException('Категорію не знайдено');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!category) throw new NotFoundException('Категорію не знайдено');
    return category;
  }

  async remove(id: string) {
    const productsCount = await this.productModel
      .countDocuments({ category: id })
      .exec();
    if (productsCount > 0) {
      throw new BadRequestException(
        `Неможливо видалити категорію: з нею повʼязано товарів — ${productsCount}. Спочатку перенесіть або видаліть ці товари.`,
      );
    }

    const category = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!category) throw new NotFoundException('Категорію не знайдено');
    return category;
  }

  async addSubcategory(id: string, dto: SubcategoryDto) {
    const category = await this.categoryModel
      .findByIdAndUpdate(
        id,
        { $push: { subcategories: dto } },
        { new: true },
      )
      .exec();
    if (!category) throw new NotFoundException('Категорію не знайдено');
    return category;
  }

  async removeSubcategory(id: string, subcategoryId: string) {
    const category = await this.categoryModel
      .findByIdAndUpdate(
        id,
        { $pull: { subcategories: { _id: subcategoryId } } },
        { new: true },
      )
      .exec();
    if (!category) throw new NotFoundException('Категорію не знайдено');
    return category;
  }
}
