import { db } from "./client";
import { services, timeSlots } from "./schema";
import { SERVICES, TIME_SLOTS } from "@/lib/clinic";

async function main() {
  await db
    .insert(timeSlots)
    .values(
      TIME_SLOTS.map((s) => ({
        key: s.key,
        label: s.label,
        startTime: s.start,
        endTime: s.end,
        weekdayMask: 0b0011111,
      })),
    )
    .onConflictDoNothing();

  await db
    .insert(services)
    .values(
      SERVICES.map((s, i) => ({
        key: s.key,
        labelEn: s.label,
        labelMs: s.label,
        category: s.category,
        priceMyr: s.price,
        active: true,
        sortOrder: i,
      })),
    )
    .onConflictDoNothing();

  console.log("seed complete");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
