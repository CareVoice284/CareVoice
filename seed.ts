import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './src/db/schema';
import dotenv from 'dotenv';
dotenv.config();

neonConfig.fetchConnectionCache = true;
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Seeding users...');
  try {
    await db.insert(schema.users).values([
      { email: 'admin@test.com', password: 'password', name: 'Admin Sarpras', role: 'admin' },
      { email: 'user@test.com', password: 'password', name: 'Staf Unit', role: 'user' },
      { email: 'teknisi@test.com', password: 'password', name: 'Teknisi Handal', role: 'teknisi' },
    ]).onConflictDoNothing(); // prevent duplicates
    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

main();
