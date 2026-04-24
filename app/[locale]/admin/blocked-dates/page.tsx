import { listBlockedDates } from "@/app/actions/admin";
import { BlockedDatesPanel } from "./blocked-dates-panel";

export const dynamic = "force-dynamic";

export default async function BlockedDatesPage() {
  const { blockedDates } = await listBlockedDates();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Blocked dates</h1>
        <p className="text-sm text-muted-foreground">Close the booking calendar for holidays or private events.</p>
      </header>
      <BlockedDatesPanel initial={blockedDates} />
    </div>
  );
}
