"use server";

import { and, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/db/client";
import { appointments, blockedDates, optometristDutyDays, optometrists } from "@/db/schema";
import {
  assignOptometristSchema,
  blockedDateSchema,
  dutyDaySchema,
  optometristInputSchema,
  updateAppointmentSchema,
} from "@/lib/schemas";

const optometristUpdateSchema = optometristInputSchema.extend({ id: z.string().uuid() });

async function assertAdmin() {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthenticated");
  const role =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ??
    (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role ??
    sessionClaims?.org_role;
  if (role !== "admin") throw new Error("Forbidden");
}

export async function listAppointments(params: {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
} = {}) {
  await assertAdmin();
  const { status, search, from, limit = 50, offset = 0 } = params;
  const where = and(
    status && status !== "all"
      ? eq(appointments.status, status as (typeof appointments.status.enumValues)[number])
      : undefined,
    from ? gte(appointments.preferredDate, from) : undefined,
    search
      ? or(
          ilike(appointments.fullName, `%${search}%`),
          ilike(appointments.phone, `%${search}%`),
          ilike(appointments.email, `%${search}%`),
          ilike(appointments.appointmentCode, `%${search}%`),
        )
      : undefined,
  );
  const rows = await db
    .select()
    .from(appointments)
    .where(where)
    .orderBy(desc(appointments.preferredDate))
    .limit(limit)
    .offset(offset);
  return { appointments: rows };
}

export async function getAdminStats() {
  await assertAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const result = await db.execute(sql`
    select
      count(*) filter (where ${appointments.preferredDate} = ${today} and ${appointments.status} in ('pending','confirmed')) as today_count,
      count(*) filter (where ${appointments.status} = 'pending') as pending_count,
      count(*) filter (where ${appointments.preferredDate} >= ${today} and ${appointments.status} in ('pending','confirmed')) as upcoming_count,
      count(*) filter (where ${appointments.status} = 'no_show') as no_show_count,
      count(*) as total_count
    from ${appointments}
  `);
  return result[0] as Record<string, string>;
}

export async function updateAppointment(raw: unknown) {
  await assertAdmin();
  const input = updateAppointmentSchema.parse(raw);
  const { id, ...rest } = input;
  await db
    .update(appointments)
    .set({ ...rest, updatedAt: new Date() })
    .where(eq(appointments.id, id));
  updateTag("slots");
  revalidatePath("/admin/appointments");
  return { ok: true };
}

export async function deleteAppointment(id: string) {
  await assertAdmin();
  await db.delete(appointments).where(eq(appointments.id, id));
  updateTag("slots");
  revalidatePath("/admin/appointments");
  return { ok: true };
}

export async function assignOptometrist(raw: unknown) {
  await assertAdmin();
  const { appointmentId, optometristId } = assignOptometristSchema.parse(raw);
  await db
    .update(appointments)
    .set({ optometristId, updatedAt: new Date() })
    .where(eq(appointments.id, appointmentId));
  revalidatePath("/admin/appointments");
  return { ok: true };
}

export async function listOptometrists() {
  await assertAdmin();
  const rows = await db.select().from(optometrists).orderBy(desc(optometrists.active), optometrists.fullName);
  return { optometrists: rows };
}

export async function addOptometrist(raw: unknown) {
  await assertAdmin();
  const input = optometristInputSchema.parse(raw);
  const [row] = await db.insert(optometrists).values(input).returning();
  revalidatePath("/admin/optometrists");
  return { optometrist: row };
}

export async function updateOptometrist(raw: unknown) {
  await assertAdmin();
  const input = optometristUpdateSchema.parse(raw);
  const { id, ...rest } = input;
  await db.update(optometrists).set({ ...rest, updatedAt: new Date() }).where(eq(optometrists.id, id));
  revalidatePath("/admin/optometrists");
  return { ok: true };
}

export async function toggleOptometristActive(id: string, active: boolean) {
  await assertAdmin();
  await db.update(optometrists).set({ active, updatedAt: new Date() }).where(eq(optometrists.id, id));
  revalidatePath("/admin/optometrists");
  return { ok: true };
}

export async function addDutyDay(raw: unknown) {
  await assertAdmin();
  const input = dutyDaySchema.parse(raw);
  await db.insert(optometristDutyDays).values(input).onConflictDoNothing();
  revalidatePath("/admin/optometrists");
  return { ok: true };
}

export async function removeDutyDay(id: string) {
  await assertAdmin();
  await db.delete(optometristDutyDays).where(eq(optometristDutyDays.id, id));
  revalidatePath("/admin/optometrists");
  return { ok: true };
}

export async function listBlockedDates() {
  await assertAdmin();
  const rows = await db.select().from(blockedDates).orderBy(desc(blockedDates.date));
  return { blockedDates: rows };
}

export async function addBlockedDate(raw: unknown) {
  await assertAdmin();
  const input = blockedDateSchema.parse(raw);
  await db.insert(blockedDates).values(input).onConflictDoNothing();
  updateTag("slots");
  revalidatePath("/admin/blocked-dates");
  return { ok: true };
}

export async function removeBlockedDate(id: string) {
  await assertAdmin();
  await db.delete(blockedDates).where(eq(blockedDates.id, id));
  updateTag("slots");
  revalidatePath("/admin/blocked-dates");
  return { ok: true };
}
