"use server";

import { and, eq } from "drizzle-orm";
import { unstable_cache, updateTag } from "next/cache";
import { addMonths, format, startOfMonth, endOfMonth } from "date-fns";
import { db } from "@/db/client";
import { appointments } from "@/db/schema";
import { computeAvailability } from "@/lib/slots";
import { appointmentCodeFrom, lastFour } from "@/lib/utils";
import {
  availabilitySchema,
  cancelAppointmentSchema,
  createAppointmentSchema,
  lookupAppointmentSchema,
} from "@/lib/schemas";

const SLOTS_TAG = "slots";

export async function getAvailableSlots(input: { startDate: string; endDate: string }) {
  const { startDate, endDate } = availabilitySchema.parse(input);
  const cached = unstable_cache(
    async () => computeAvailability(new Date(startDate), new Date(endDate)),
    ["slots", startDate, endDate],
    { tags: [SLOTS_TAG], revalidate: 60 },
  );
  return { availableSlots: await cached() };
}

export async function getMonthSlots(monthOffset = 0) {
  const base = addMonths(new Date(), monthOffset);
  const start = startOfMonth(base);
  const end = endOfMonth(base);
  return getAvailableSlots({ startDate: format(start, "yyyy-MM-dd"), endDate: format(end, "yyyy-MM-dd") });
}

export async function createAppointment(raw: unknown) {
  const input = createAppointmentSchema.parse(raw);
  const code = appointmentCodeFrom(input.phone);

  const existing = await db
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.preferredDate, input.preferredDate),
        eq(appointments.preferredTimeSlot, input.preferredTimeSlot),
      ),
    )
    .limit(1);
  if (existing.length > 0) {
    throw new Error("This time slot is already booked. Please select another slot.");
  }

  const [row] = await db
    .insert(appointments)
    .values({
      appointmentCode: code,
      fullName: input.fullName,
      email: input.email,
      countryCode: input.countryCode,
      phone: input.phone,
      serviceKey: input.serviceKey,
      trainingKeys: input.trainingKeys ?? null,
      trainingOther: input.trainingOther ?? null,
      sponsored: input.sponsored,
      sponsorReason: input.sponsorReason ?? null,
      notes: input.notes ?? null,
      preferredDate: input.preferredDate,
      preferredTimeSlot: input.preferredTimeSlot,
      pdpaConsents: input.pdpaConsents,
      status: "pending",
    })
    .returning();

  updateTag(SLOTS_TAG);
  return {
    appointment: {
      code: row.appointmentCode,
      phoneLast4: lastFour(row.phone),
      fullName: row.fullName,
      preferredDate: row.preferredDate,
      preferredTimeSlot: row.preferredTimeSlot,
      status: row.status,
    },
  };
}

export async function getAppointmentForStatus(raw: unknown) {
  const { appointmentCode, phoneLast4 } = lookupAppointmentSchema.parse(raw);
  const rows = await db
    .select()
    .from(appointments)
    .where(eq(appointments.appointmentCode, appointmentCode))
    .limit(1);
  const row = rows[0];
  if (!row || lastFour(row.phone) !== phoneLast4) {
    return { appointment: null };
  }
  return {
    appointment: {
      code: row.appointmentCode,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      serviceKey: row.serviceKey,
      preferredDate: row.preferredDate,
      preferredTimeSlot: row.preferredTimeSlot,
      status: row.status,
      notes: row.notes,
      createdAt: row.createdAt,
    },
  };
}

export async function cancelPublicAppointment(raw: unknown) {
  const { appointmentCode, phoneLast4, reason } = cancelAppointmentSchema.parse(raw);
  const rows = await db
    .select()
    .from(appointments)
    .where(eq(appointments.appointmentCode, appointmentCode))
    .limit(1);
  const row = rows[0];
  if (!row || lastFour(row.phone) !== phoneLast4) {
    throw new Error("Appointment not found.");
  }
  if (row.status === "cancelled") return { ok: true, alreadyCancelled: true };
  await db
    .update(appointments)
    .set({ status: "cancelled", cancellationReason: reason, updatedAt: new Date() })
    .where(eq(appointments.id, row.id));
  updateTag(SLOTS_TAG);
  return { ok: true };
}
