import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, CategorySchema } from '../categories/schemas/category.schema.js';
import { slugify } from '../common/slugify.js';

/**
 * One-off migration: recomputes every category/subcategory slug from its
 * name with the real Cyrillic→Latin slugify() (backend/src/common/slugify.ts),
 * replacing the raw-Cyrillic slugs the old client-supplied-slug flow left
 * in place. Run once against the real DB:
 *
 *   cd backend && npx ts-node src/scripts/migrate-category-slugs.ts
 */
async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const CategoryModel = mongoose.model(Category.name, CategorySchema);
  const categories = await CategoryModel.find();

  for (const category of categories) {
    const newSlug = slugify(category.name);
    if (category.slug !== newSlug) {
      console.log(`Category "${category.name}": ${category.slug} → ${newSlug}`);
      category.slug = newSlug;
    }

    for (const sub of category.subcategories) {
      const newSubSlug = slugify(sub.name);
      if (sub.slug !== newSubSlug) {
        console.log(`  Subcategory "${sub.name}": ${sub.slug} → ${newSubSlug}`);
        sub.slug = newSubSlug;
      }
    }

    await category.save();
  }

  console.log('Done.');
  await mongoose.disconnect();
}

await migrate();
