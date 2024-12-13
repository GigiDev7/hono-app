import {
  integer,
  pgTable,
  varchar,
  numeric,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";

export const facilityType = pgEnum("facility_type", [
  "Manufacturing Plants",
  "Warehouses",
  "Distribution Centers",
  "Research and Development Centers",
  "Maintenance and Repair Facilities",
  "Logistics Hubs",
  "Quality Control Laboratories",
  "Refineries",
  "Energy Plants",
  "Water Treatment Plants",
  "Smelting and Refining Facilities",
  "Chemical Processing Plants",
  "Assembly Plants",
]);

export const facilities = pgTable("facilities", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  type: facilityType("type"),
  state: varchar("state", { length: 50 }).notNull(),
  city: varchar("city", { length: 50 }).notNull(),
  address: text("address").notNull(),
  imageUrl: text("image_url"),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
  siteLeader: varchar("site_leader"),
});
