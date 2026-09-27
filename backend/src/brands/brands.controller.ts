import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandsService } from './brands.service.js';
import { CreateBrandDto } from './dto/create-brand.dto.js';
import { UpdateBrandDto } from './dto/update-brand.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { imageUploadOptions } from '../common/multer.config.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Controller('brands')
export class BrandsController {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.brandsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const brand = await this.brandsService.findOne(id);
    const result = await this.brandsService.remove(id);
    if (brand.imagePublicId) {
      await this.cloudinaryService.deleteImage(brand.imagePublicId);
    }
    return result;
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Файл не надано');
    const brand = await this.brandsService.findOne(id);
    if (brand.imagePublicId) {
      await this.cloudinaryService.deleteImage(brand.imagePublicId);
    }
    const result = await this.cloudinaryService.uploadImage(file.buffer);
    return this.brandsService.setImage(id, {
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  @Delete(':id/image')
  async removeImage(@Param('id') id: string) {
    const brand = await this.brandsService.findOne(id);
    if (brand.imagePublicId) {
      await this.cloudinaryService.deleteImage(brand.imagePublicId);
    }
    return this.brandsService.clearImage(id);
  }
}
