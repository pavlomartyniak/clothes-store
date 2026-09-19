import { IsString } from 'class-validator';

export class RemoveImageDto {
  @IsString()
  path: string;
}
