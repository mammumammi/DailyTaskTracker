import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local
const result = dotenv.config({ path: path.join(__dirname, '../.env.local') });

if (result.error) {
  console.error('❌ Error loading .env.local:', result.error);
} else {
  console.log('✅ .env.local loaded successfully');
}

console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL?.substring(0, 30) + '...');