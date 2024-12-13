CREATE TYPE "public"."facility_type" AS ENUM('Manufacturing Plants', 'Warehouses', 'Distribution Centers', 'Research and Development Centers', 'Maintenance and Repair Facilities', 'Logistics Hubs', 'Quality Control Laboratories', 'Refineries', 'Energy Plants', 'Water Treatment Plants', 'Smelting and Refining Facilities', 'Chemical Processing Plants', 'Assembly Plants');--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "facilities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"type" "facility_type",
	"state" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"address" text NOT NULL,
	"image_url" text,
	"zip_code" varchar(10) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"site_leader" varchar
);
