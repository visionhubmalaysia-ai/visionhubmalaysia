import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { format } from "date-fns";
import { db } from "@/db/client";
import { appointments, blockedDates } from "@/db/schema";
import { TIME_SLOTS } from "@/lib/clinic";

export type DaySlot = {
  date: string;
  dayOfWeek: number;
  isWeekday: boolean;
  isBlocked: boolean;
  timeSlots: Array<{ key: string; label: string; available: boolean; bookedAppointmentCode?: string }>;
};

export async function computeAvailability(startDate: Date, endDate: Date): Promise<DaySlot[]> {
  const start = format(startDate, "yyyy-MM-dd");
  const end = format(endDate, "yyyy-MM-dd");

  const [apts, blocks] = await Promise.all([
    db
      .select({
        code: appointments.appointmentCode,
        date: appointments.preferredDate,
        slot: appointments.preferredTimeSlot,
        status: appointments.status,
      })
      .from(appointments)
      .where(
        and(
          gte(appointments.preferredDate, start),
          lte(appointments.preferredDate, end),
          inArray(appointments.status, ["pending", "confirmed"]),
        ),
      ),
    db
      .select({ date: blockedDates.date })
      .from(blockedDates)
      .where(and(gte(blockedDates.date, start), lte(blockedDates.date, end))),
  ]);

  const blockedSet = new Set(blocks.map((b) => b.date));
  const bookedByDate = new Map<string, Map<string, string>>();
  for (const a of apts) {
    const m = bookedByDate.get(a.date) ?? new Map();
    m.set(a.slot, a.code);
    bookedByDate.set(a.date, m);
  }

  const result: DaySlot[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const iso = format(cursor, "yyyy-MM-dd");
    const dow = cursor.getDay();
    const isWeekday = dow >= 1 && dow <= 5;
    const isBlocked = blockedSet.has(iso);
    const booked = bookedByDate.get(iso) ?? new Map<string, string>();

    result.push({
      date: iso,
      dayOfWeek: dow,
      isWeekday,
      isBlocked,
      timeSlots: TIME_SLOTS.map((s) => ({
        key: s.key,
        label: s.label,
        available: isWeekday && !isBlocked && !booked.has(s.key),
        bookedAppointmentCode: booked.get(s.key),
      })),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}
