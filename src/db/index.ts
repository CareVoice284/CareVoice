import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// This is mainly for backend/serverless usage. Do not import this directly into frontend components.
// Ensure DATABASE_URL is available in process.env
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_IAumTdQ31egH@ep-frosty-silence-aqqw2c7c-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
