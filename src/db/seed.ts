import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sensors } from './schema';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Definisikan interface untuk tipe data CSV
interface CsvRecord {
  City: string;
  Country: string;
  Date: string;
  'PM2.5': string;
  PM10: string;
  NO2: string;
  SO2: string;
  CO: string;
  O3: string;
  Temperature: string;
  Humidity: string;
  'Wind Speed': string;
}

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function main() {
  console.log('Seeding database...');

  const csvFilePath = './global_air_quality_data_10000.csv';
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  const records: CsvRecord[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Found ${records.length} records in CSV.`);

  const BATCH_SIZE = 500; // Ukuran batch untuk setiap insert

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE).map((record) => ({
      city: record.City,
      country: record.Country,
      date: record.Date,
      pm25: record['PM2.5'] ? parseFloat(record['PM2.5']) : null,
      pm10: record.PM10 ? parseFloat(record.PM10) : null,
      no2: record.NO2 ? parseFloat(record.NO2) : null,
      so2: record.SO2 ? parseFloat(record.SO2) : null,
      co: record.CO ? parseFloat(record.CO) : null,
      o3: record.O3 ? parseFloat(record.O3) : null,
      temperature: record.Temperature ? parseFloat(record.Temperature) : null,
      humidity: record.Humidity ? parseFloat(record.Humidity) : null,
      windSpeed: record['Wind Speed'] ? parseFloat(record['Wind Speed']) : null,
    }));

    console.log(
      `Inserting batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
        records.length / BATCH_SIZE
      )}...`
    );
    await db.insert(sensors).values(batch);
  }

  console.log('Seeding finished!');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed: ', err);
  process.exit(1);
});
