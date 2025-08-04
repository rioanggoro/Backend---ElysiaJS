import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema';

const db = drizzle(postgres(process.env.DATABASE_URL!), { schema });

async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('Migrations finished!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed: ', err);
  process.exit(1);
});
