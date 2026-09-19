import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// src/common/uploads-path.ts -> dist/common/uploads-path.js at runtime,
// so climbing two levels lands on the project root.
export const uploadsDir = join(__dirname, '..', '..', 'uploads');
