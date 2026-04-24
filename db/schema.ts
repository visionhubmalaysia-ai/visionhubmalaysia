import { sql } from "drizzle-orm";
import {
  pgSchema,
  uuid,
  text,
  date,
  timestamp,
  boolean,
  integer,
  jsonb,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const visionhubSchema = pgSchema("visionhub");

export const appointmentStatus = visionhubSchema.enum("appointment_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
]);

export const dutyShift = visionhubSchema.enum("duty_shift", ["morning", "afternoon", "full"]);

export const services = visionhubSchema.table("services", {
  key: text("key").primaryKey(),
  labelEn: text("label_en").notNull(),
  labelMs: text("label_ms").notNull(),
  category: text("category").notNull(),
  priceMyr: integer("price_myr").notNull().default(0),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const timeSlots = visionhubSchema.table("time_slots", {
  key: text("key").primaryKey(),
  label: text("label").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  weekdayMask: integer("weekday_mask").notNull().default(0b0011111),
});

export const optometrists = visionhubSchema.table("optometrists", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  specialization: text("specialization"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const optometristDutyDays = visionhubSchema.table(
  "optometrist_duty_days",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    optometristId: uuid("optometrist_id")
      .notNull()
      .references(() => optometrists.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    shift: dutyShift("shift").notNull().default("full"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.optometristId, t.date, t.shift),
    byDate: index("duty_days_date_idx").on(t.date),
  }),
);

export const blockedDates = visionhubSchema.table("blocked_dates", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull().unique(),
  reason: text("reason"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const appointments = visionhubSchema.table(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appointmentCode: text("appointment_code").notNull().unique(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    countryCode: text("country_code").notNull().default("+60"),
    phone: text("phone").notNull(),
    serviceKey: text("service_key")
      .notNull()
      .references(() => services.key),
    trainingKeys: text("training_keys").array(),
    trainingOther: text("training_other"),
    sponsored: boolean("sponsored").notNull().default(false),
    sponsorReason: text("sponsor_reason"),
    notes: text("notes"),
    preferredDate: date("preferred_date").notNull(),
    preferredTimeSlot: text("preferred_time_slot").notNull(),
    status: appointmentStatus("status").notNull().default("pending"),
    optometristId: uuid("optometrist_id").references(() => optometrists.id, { onDelete: "set null" }),
    cancellationReason: text("cancellation_reason"),
    pdpaConsents: jsonb("pdpa_consents").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    uniqueSlot: unique("appointments_slot_unique").on(t.preferredDate, t.preferredTimeSlot),
    byDate: index("appointments_date_idx").on(t.preferredDate),
    byStatus: index("appointments_status_idx").on(t.status),
  }),
);

export const trainingOptions = visionhubSchema.table("training_options", {
  key: text("key").primaryKey(),
  labelEn: text("label_en").notNull(),
  labelMs: text("label_ms").notNull(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const publicHolidays = visionhubSchema.table("public_holidays", {
  date: date("date").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameMs: text("name_ms"),
  active: boolean("active").notNull().default(true),
});

export const appointmentEvents = visionhubSchema.table(
  "appointment_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    appointmentId: uuid("appointment_id")
      .notNull()
      .references(() => appointments.id, { onDelete: "cascade" }),
    actor: text("actor"),
    event: text("event").notNull(),
    fromValue: jsonb("from_value"),
    toValue: jsonb("to_value"),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    byAppointment: index("appointment_events_appointment_idx").on(t.appointmentId),
  }),
);

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;
export type Optometrist = typeof optometrists.$inferSelect;
export type BlockedDate = typeof blockedDates.$inferSelect;
export type Service = typeof services.$inferSelect;
export type TrainingOption = typeof trainingOptions.$inferSelect;
export type PublicHoliday = typeof publicHolidays.$inferSelect;
export type AppointmentEvent = typeof appointmentEvents.$inferSelect;
