import 'dotenv/config';
import mongoose from 'mongoose';
import { Product, ProductSchema } from '../products/schemas/product.schema.js';
import { slugify } from '../common/slugify.js';

/**
 * One-off migration: recomputes every product's slug from its name with the
 * real Cyrillic→Latin slugify() (backend/src/common/slugify.ts), replacing
 * the raw-Cyrillic slugs the old client-supplied-slug flow left in place.
 * Dedupes against every other *new* slug already assigned in this run (not
 * just what's already saved), the same way the live service's create() does.
 * Run once against the real DB:
 *
 *   cd backend && npx ts-node src/scripts/migrate-product-slugs.ts
 */
async function migrate() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const ProductModel = mongoose.model(Product.name, ProductSchema);
  const products = await ProductModel.find();

  const takenSlugs = new Set<string>();

  for (const product of products) {
    const base = slugify(product.name);
    let newSlug = base;
    let suffix = 2;
    while (takenSlugs.has(newSlug)) {
      newSlug = `${base}-${suffix}`;
      suffix += 1;
    }
    takenSlugs.add(newSlug);

    if (product.slug !== newSlug) {
      console.log(`Product "${product.name}": ${product.slug} → ${newSlug}`);
      product.slug = newSlug;
      await product.save();
    }
  }

  console.log('Done.');
  await mongoose.disconnect();
}

await migrate();
