import { listAppointments, listOptometrists } from "@/app/actions/admin";
import { AppointmentsTable } from "./appointments-table";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { status, search } = await searchParams;
  const [{ appointments }, { optometrists }] = await Promise.all([
    listAppointments({ status, search }),
    listOptometrists(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Appointments</h1>
        <p className="text-sm text-muted-foreground">Manage bookings, assign optometrists, reschedule or cancel.</p>
      </header>
      <AppointmentsTable initialRows={appointments} optometrists={optometrists} initialStatus={status ?? "all"} initialSearch={search ?? ""} />
    </div>
  );
}
