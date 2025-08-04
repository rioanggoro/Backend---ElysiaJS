import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { db } from './db/db';
import { sensors } from './db/schema';
import { count, eq, sql } from 'drizzle-orm';
import redis from './redis';

const app = new Elysia()
  // Tambahkan plugin CORS agar bisa diakses oleh frontend Svelte
  .use(cors())

  // Endpoint untuk mengambil data dengan paginasi dan caching
  .get('/sensors', async ({ query }) => {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 25; // Default 25 data per halaman
    const offset = (page - 1) * limit;

    const cacheKey = `sensors:page-${page}:limit-${limit}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const sensorsData = await db
      .select()
      .from(sensors)
      .limit(limit)
      .offset(offset);

    const totalCount = await db.select({ count: count() }).from(sensors);
    const totalItems = totalCount[0].count;
    const totalPages = Math.ceil(totalItems / limit);

    const response = {
      data: sensorsData,
      pagination: {
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    };

    // Simpan data ke cache dengan TTL 1 jam (3600 detik)
    await redis.set(cacheKey, JSON.stringify(response), 'EX', 3600);

    return response;
  })

  // Logika invalidation pada endpoint yang mengubah data
  .post(
    '/sensors',
    async ({ body, set }) => {
      // Hapus semua cache yang berkaitan dengan endpoint sensors
      await redis.del(await redis.keys('sensors:*'));
      const newSensor = await db.insert(sensors).values(body).returning();
      set.status = 201;
      return newSensor[0];
    },
    {
      body: t.Object({
        city: t.String(),
        country: t.String(),
        date: t.String(),
        pm25: t.Number(),
        pm10: t.Number(),
        no2: t.Number(),
        so2: t.Number(),
        co: t.Number(),
        o3: t.Number(),
        temperature: t.Number(),
        humidity: t.Number(),
        windSpeed: t.Number(),
      }),
    }
  )

  .put(
    '/sensors/:id',
    async ({ params, body, set }) => {
      await redis.del(await redis.keys('sensors:*'));
      const updatedSensor = await db
        .update(sensors)
        .set(body)
        .where(eq(sensors.id, parseInt(params.id)))
        .returning();
      if (!updatedSensor.length) {
        set.status = 404;
        return { message: 'Sensor not found' };
      }
      return updatedSensor[0];
    },
    {
      params: t.Object({ id: t.String() }),
      body: t.Object({
        city: t.String(),
        country: t.String(),
        date: t.String(),
        pm25: t.Number(),
        pm10: t.Number(),
        no2: t.Number(),
        so2: t.Number(),
        co: t.Number(),
        o3: t.Number(),
        temperature: t.Number(),
        humidity: t.Number(),
        windSpeed: t.Number(),
      }),
    }
  )

  .delete('/sensors/:id', async ({ params, set }) => {
    await redis.del(await redis.keys('sensors:*'));
    const deletedSensor = await db
      .delete(sensors)
      .where(eq(sensors.id, parseInt(params.id)))
      .returning();
    if (!deletedSensor.length) {
      set.status = 404;
      return { message: 'Sensor not found' };
    }
    set.status = 204;
  })

  .get(
    '/sensors/:id',
    async ({ params, set }) => {
      const sensor = await db
        .select()
        .from(sensors)
        .where(eq(sensors.id, parseInt(params.id)));
      if (!sensor.length) {
        set.status = 404;
        return { message: 'Sensor not found' };
      }
      return sensor[0];
    },
    {
      params: t.Object({ id: t.String() }),
    }
  )

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
