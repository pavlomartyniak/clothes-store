import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductColorDto {
  @IsString()
  name: string;

  @IsString()
  hex: string;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsMongoId()
  category: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsOptional()
  @IsMongoId()
  brand?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  oldPrice?: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  details?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  colors?: ProductColorDto[];

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @IsOptional()
  @IsBoolean()
  isBestseller?: boolean;

  @IsOptional()
  @IsBoolean()
  soldOut?: boolean;
}
