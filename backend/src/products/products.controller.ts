import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { RemoveImageDto } from './dto/remove-image.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { imageUploadOptions } from '../common/multer.config.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Public()
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll({ category, subcategory, search });
  }

  @Public()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Файл не надано');
    const result = await this.cloudinaryService.uploadImage(file.buffer);
    return this.productsService.addImage(id, {
      url: result.secure_url,
      publicId: result.public_id,
    });
  }

  @Delete(':id/images')
  async removeImage(@Param('id') id: string, @Body() dto: RemoveImageDto) {
    await this.cloudinaryService.deleteImage(dto.publicId);
    return this.productsService.removeImage(id, dto.publicId);
  }
}
