import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
export class ProductColor {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  hex: string;
}

export const ProductColorSchema = SchemaFactory.createForClass(ProductColor);

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ required: true, trim: true })
  subcategory: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  oldPrice?: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  details: string[];

  @Prop({ type: [String], default: [] })
  sizes: string[];

  @Prop({ type: [ProductColorSchema], default: [] })
  colors: ProductColor[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: false })
  isNew: boolean;

  @Prop({ default: false })
  isBestseller: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
