import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller.js';
import { TelegramImportService } from './telegram-import.service.js';
import { ProductsModule } from '../products/products.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { BrandsModule } from '../brands/brands.module.js';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';

@Module({
  imports: [ProductsModule, CategoriesModule, BrandsModule, CloudinaryModule],
  controllers: [TelegramController],
  providers: [TelegramImportService],
})
export class TelegramModule {}
