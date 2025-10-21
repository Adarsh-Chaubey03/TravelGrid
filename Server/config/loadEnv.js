import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env located in the Server folder (one level up from this file)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Optionally log when in dev
if (process.env.NODE_ENV !== 'production') {
  console.debug('[loadEnv] Loaded .env from', path.resolve(__dirname, '../.env'));
}
