import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: (() => {
    const url = new URL(process.env.DATABASE_URL!);
    return {
      host: url.hostname,
      port: Number(url.port) || 5432,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl:
        url.searchParams.get('sslmode') === 'require' ? 'require' : undefined,
    };
  })(),
});
