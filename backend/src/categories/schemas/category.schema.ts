import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Subcategory {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true })
  slug: string;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop({ trim: true })
  description?: string;

  /** Long-form SEO body copy shown under the product grid on the category page. */
  @Prop({ trim: true })
  content?: string;

  @Prop({ type: [SubcategorySchema], default: [] })
  subcategories: (Subcategory & { _id: Types.ObjectId })[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
