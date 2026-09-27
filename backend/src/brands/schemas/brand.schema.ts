import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  slug: string;

  @Prop()
  imageUrl?: string;

  /** Cloudinary's asset id — required to delete the file later. */
  @Prop()
  imagePublicId?: string;

  /** Long-form SEO body copy shown under the product grid on the brand page. */
  @Prop({ trim: true })
  content?: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
