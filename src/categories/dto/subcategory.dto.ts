import { IsString } from 'class-validator';

export class SubcategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;
}
