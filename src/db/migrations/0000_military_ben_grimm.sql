CREATE TABLE "sensors" (
	"id" serial PRIMARY KEY NOT NULL,
	"city" varchar(255) NOT NULL,
	"country" varchar(255) NOT NULL,
	"date" date NOT NULL,
	"pm25" double precision,
	"pm10" double precision,
	"no2" double precision,
	"so2" double precision,
	"co" double precision,
	"o3" double precision,
	"temperature" double precision,
	"humidity" double precision,
	"wind_speed" double precision
);
