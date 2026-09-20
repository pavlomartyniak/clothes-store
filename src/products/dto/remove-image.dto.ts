import { IsString } from 'class-validator';

export class RemoveImageDto {
  @IsString()
  publicId: string;
}
