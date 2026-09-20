import 'dotenv/config';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AdminUser, AdminUserSchema } from './auth/schemas/admin-user.schema.js';
import { Category, CategorySchema } from './categories/schemas/category.schema.js';

const CATEGORIES = [
  {
    name: 'Жінкам',
    slug: 'жінкам',
    description: 'Сукні, светри, верхній одяг',
    subcategories: [
      { name: 'Светри', slug: 'светри' },
      { name: 'Сукні', slug: 'сукні' },
      { name: 'Верхній одяг', slug: 'верхній одяг' },
      { name: 'Штани', slug: 'штани' },
    ],
  },
  {
    name: 'Чоловікам',
    slug: 'чоловікам',
    description: 'Костюми, сорочки, джинси',
    subcategories: [
      { name: 'Костюми', slug: 'костюми' },
      { name: 'Сорочки', slug: 'сорочки' },
      { name: 'Верхній одяг', slug: 'верхній одяг' },
      { name: 'Штани', slug: 'штани' },
      { name: 'Футболки', slug: 'футболки' },
    ],
  },
  {
    name: 'Дітям',
    slug: 'дітям',
    description: 'Комфортний одяг для активних днів',
    subcategories: [
      { name: 'Верхній одяг', slug: 'верхній одяг' },
      { name: 'Сукні', slug: 'сукні' },
      { name: 'Костюми', slug: 'костюми' },
    ],
  },
  {
    name: 'Аксесуари',
    slug: 'аксесуари',
    description: 'Сумки, шарфи, ремені',
    subcategories: [
      { name: 'Сумки', slug: 'сумки' },
      { name: 'Шарфи', slug: 'шарфи' },
      { name: 'Головні убори', slug: 'головні убори' },
      { name: 'Ремені', slug: 'ремені' },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const AdminUserModel = mongoose.model(AdminUser.name, AdminUserSchema);
  const CategoryModel = mongoose.model(Category.name, CategorySchema);

  const adminEmail = (process.env.ADMIN_EMAIL ?? 'admin@siluet.ua').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';

  const existingAdmin = await AdminUserModel.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log(`Admin user already exists: ${adminEmail}`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await AdminUserModel.create({
      email: adminEmail,
      passwordHash,
      name: 'SILUET Admin',
    });
    console.log(`Created admin user: ${adminEmail}`);
  }

  for (const category of CATEGORIES) {
    const existing = await CategoryModel.findOne({ slug: category.slug });
    if (existing) {
      console.log(`Category already exists: ${category.name}`);
      continue;
    }
    await CategoryModel.create(category);
    console.log(`Created category: ${category.name}`);
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
