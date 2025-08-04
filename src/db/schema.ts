import {
  pgTable,
  serial,
  varchar,
  date,
  doublePrecision,
} from 'drizzle-orm/pg-core';

export const sensors = pgTable('sensors', {
  id: serial('id').primaryKey(),
  city: varchar('city', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  date: date('date').notNull(),
  pm25: doublePrecision('pm25'),
  pm10: doublePrecision('pm10'),
  no2: doublePrecision('no2'),
  so2: doublePrecision('so2'),
  co: doublePrecision('co'),
  o3: doublePrecision('o3'),
  temperature: doublePrecision('temperature'),
  humidity: doublePrecision('humidity'),
  windSpeed: doublePrecision('wind_speed'),
});
