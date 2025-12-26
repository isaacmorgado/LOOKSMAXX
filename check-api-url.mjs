// Check what API_URL resolves to in different environments
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local
try {
  const envLocal = readFileSync(join(__dirname, '.env.local'), 'utf-8');
  console.log('.env.local contents:');
  console.log(envLocal);
} catch (e) {
  console.log('No .env.local file');
}

// Read .env.production
try {
  const envProd = readFileSync(join(__dirname, '.env.production'), 'utf-8');
  console.log('\n.env.production contents:');
  console.log(envProd);
} catch (e) {
  console.log('No .env.production file');
}

// Check what the constant would resolve to
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log('\nResolved API_URL:', API_URL);
