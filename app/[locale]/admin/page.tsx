import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock4, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { getAdminStats, listAppointments } from "@/app/actions/admin";
import { TIME_SLOTS } from "@/lib/clinic";
import { Link } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [stats, todayList] = await Promise.all([
    getAdminStats(),
    listAppointments({
      from: new Date().toISOString().slice(0, 10),
      limit: 10,
    }),
  ]);

  const cards = [
    { icon: Calendar, label: "Today", value: stats.today_count ?? "0", hint: "pending + confirmed" },
    { icon: Clock4, label: "Awaiting confirmation", value: stats.pending_count ?? "0", hint: "pending" },
    { icon: TrendingUp, label: "Upcoming", value: stats.upcoming_count ?? "0", hint: "from today onward" },
    { icon: AlertTriangle, label: "No-shows (all-time)", value: stats.no_show_count ?? "0", hint: "missed appointments" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">What's happening at VISION HUB.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {c.label}
              </CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-4xl">{c.value}</div>
              <p className="text-xs text-muted-foreground">{c.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today & upcoming</CardTitle>
          <CardDescription>Next 10 appointments.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {todayList.appointments.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing scheduled.</p>
          ) : (
            todayList.appointments.map((a) => (
              <Link
                key={a.id}
                href={`/admin/appointments?code=${a.appointmentCode}`}
                className="flex items-center justify-between rounded-lg border px-4 py-3 transition hover:border-primary"
              >
                <div>
                  <div className="font-medium">{a.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(a.preferredDate), "EEE, d MMM")} ·{" "}
                    {TIME_SLOTS.find((s) => s.key === a.preferredTimeSlot)?.label ?? a.preferredTimeSlot}
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {a.status.replace("_", " ")}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
