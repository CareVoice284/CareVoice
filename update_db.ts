import { neon } from '@neondatabase/serverless';

const sql = neon("postgresql://neondb_owner:npg_IAumTdQ31egH@ep-frosty-silence-aqqw2c7c-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function run() {
  await sql`UPDATE users SET name = 'Pasien' WHERE email = 'user@test.com'`;
  console.log('Database updated: user@test.com is now Pasien!');
}
run();
