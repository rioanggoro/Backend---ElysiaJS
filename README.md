# 🌳 ElysiaJS Environmental Data API

API ini dibuat untuk mengelola data sensor kualitas udara dengan fungsionalitas CRUD (Create, Read, Update, Delete). Dibangun menggunakan stack modern yang cepat dan efisien.

## ✨ Fitur Utama

- **CRUD Lengkap**: Operasi `Create`, `Read`, `Update`, dan `Delete` untuk data sensor.
- **Paginasi**: Endpoint `GET /sensors` mendukung paginasi untuk menangani dataset besar.
- **Caching**: Caching dengan Redis untuk mempercepat respons pada request yang sering diakses.
- **ORM Modern**: Menggunakan Drizzle ORM untuk interaksi database yang aman dan efisien.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **Runtime**: [Bun](https://bun.sh/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (dihosting di [NeonDB](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Caching**: [Redis](https://redis.io/) (dihosting di [Upstash](https://upstash.com/))

---

## 🚀 Cara Memulai (Development Environment)

Ikuti langkah-langkah berikut untuk menjalankan API ini di lingkungan lokalmu.

### Prasyarat

- [Bun](https://bun.sh/docs/installation) (v1.1.30 atau lebih baru)
- Akun [NeonDB](https://neon.tech/) untuk database PostgreSQL
- Akun [Upstash](https://upstash.com/) untuk Redis

### Langkah-langkah Instalasi

1.  **Clone Repositori**

    ```bash
    git clone https://github.com/rioanggoro/Backend---ElysiaJS
    cd [nama-repo-backend]
    ```

2.  **Konfigurasi Environment** 💡
    Buat file `.env` di root proyek dan isi dengan kredensial dari NeonDB dan Upstash.

    ```env
    # .env
    DATABASE_URL="postgresql://neondb_owner:npg_vCl6gr1aXhck@ep-patient-band-ad25f249-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    ```

    UPSTASH_REDIS_URL="rediss://default:ASJBAAIjcDFhMDU5NDIyZWMwZDc0OTBlOGEyMzVkNjI5YWJjODJhMHAxMA@awake-flea-8769.upstash.io:6379"

````

3.  **Instalasi Dependensi**

    ```bash
    bun install
    ```

4.  **Migrasi Database**
    Jalankan skrip migrasi untuk membuat tabel `sensors` di database-mu.

    ```bash
    bun src/db/migrate.ts
    ```

5.  **Seeding Data (Opsional)**
    Impor data awal dari file CSV. Pastikan file `global_air_quality_data_10000.csv` ada di root proyek.

    ```bash
    bun src/db/seed.ts
    ```

6.  **Jalankan Server** ✅
    ```bash
    bun dev
    ```
    API akan berjalan di `http://localhost:3000`.

---

## 🔌 API Endpoints

Berikut adalah daftar endpoint yang tersedia.



---

### 1. Get All Sensors (with Pagination)

Mengambil daftar data sensor dengan paginasi.

- **Method**: `GET`
- **Endpoint**: `/sensors`
- **Query Params**:
  - `page` (opsional, `int`, default: `1`)
  - `limit` (opsional, `int`, default: `25`)
- **Respons Sukses** (`200 OK`):
  ```json
  {
    "data": [
      {
        "id": 1,
        "city": "London",
        "country": "United Kingdom",
        "date": "...",
        "pm25": 12.5
      },
      {
        "id": 2,
        "city": "Paris",
        "country": "France",
        "date": "...",
        "pm25": 15.2
      }
    ],
    "pagination": {
      "totalItems": 10000,
      "totalPages": 400,
      "currentPage": 1
    }
  }
````

### 2. Get Sensor by ID

Mengambil detail data sensor berdasarkan ID-nya.

- **Method**: `GET`
- **Endpoint**: `/sensors/:id`
- **Respons Sukses** (`200 OK`):
  ```json
  {
    "id": 1,
    "city": "London",
    "country": "United Kingdom",
    "date": "2025-08-01T00:00:00.000Z",
    "pm25": 12.5,
    "pm10": 20.1,
    "o3": 30.3,
    "no2": 18.7,
    "so2": 5.4,
    "co": 0.4
  }
  ```

### 3. Add New Sensor

Menambahkan data sensor baru. 🔐 **Memerlukan autentikasi**.

- **Method**: `POST`
- **Endpoint**: `/sensors`
- **Request Body** (`application/json`):
  ```json
  {
    "city": "Jakarta",
    "country": "Indonesia",
    "date": "2025-08-04",
    "pm25": 45.6,
    "pm10": 55.2,
    "o3": 25.1,
    "no2": 33.9,
    "so2": 8.1,
    "co": 0.9
  }
  ```
- **Respons Sukses** (`201 Created`): Mengembalikan data yang baru dibuat.

### 4. Update Sensor

Memperbarui data sensor yang sudah ada. 🔐 **Memerlukan autentikasi**.

- **Method**: `PUT`
- **Endpoint**: `/sensors/:id`
- **Request Body** (`application/json`):
  ```json
  {
    "city": "Jakarta Pusat",
    "pm25": 48.1
  }
  ```
- **Respons Sukses** (`200 OK`): Mengembalikan data yang sudah diperbarui.

### 5. Delete Sensor

Menghapus data sensor berdasarkan ID. 🔐 **Memerlukan autentikasi**.

- **Method**: `DELETE`
- **Endpoint**: `/sensors/:id`
- **Respons Sukses** (`204 No Content`): Tidak ada body respons.
