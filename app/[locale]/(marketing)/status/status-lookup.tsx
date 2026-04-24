"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search, Loader2, CalendarX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cancelPublicAppointment, getAppointmentForStatus } from "@/app/actions/public";
import { SERVICES, TIME_SLOTS } from "@/lib/clinic";

type Result = NonNullable<Awaited<ReturnType<typeof getAppointmentForStatus>>["appointment"]>;

const STATUS_VARIANT: Record<string, "default" | "success" | "destructive" | "secondary" | "outline" | "accent"> = {
  pending: "outline",
  confirmed: "success",
  cancelled: "destructive",
  completed: "secondary",
  no_show: "destructive",
};

export function StatusLookup({ initialCode }: { initialCode: string }) {
  const t = useTranslations();
  const [code, setCode] = useState(initialCode);
  const [last4, setLast4] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [searched, setSearched] = useState(false);
  const [searching, startSearch] = useTransition();
  const [reason, setReason] = useState("");
  const [cancelling, startCancel] = useTransition();

  const search = () => {
    setSearched(false);
    startSearch(async () => {
      const res = await getAppointmentForStatus({ appointmentCode: code.replace(/\D/g, ""), phoneLast4: last4 });
      setResult(res.appointment);
      setSearched(true);
    });
  };

  const cancel = () => {
    if (!result) return;
    startCancel(async () => {
      try {
        await cancelPublicAppointment({
          appointmentCode: result.code,
          phoneLast4: last4,
          reason,
        });
        toast.success("Appointment cancelled");
        setResult({ ...result, status: "cancelled" });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Unable to cancel.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("header.statusTitle")}</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">{t("status.search")}</h1>
        <p className="mt-3 text-muted-foreground">
          Enter your appointment code (the phone digits you booked with) and the last 4 digits of that phone number.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t("status.search")}</CardTitle>
          <CardDescription>{t("status.searchDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <div className="grid gap-2">
              <Label>{t("status.appointmentId")}</Label>
              <Input
                placeholder="e.g. 182138476"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone last 4</Label>
              <Input
                placeholder="8476"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                inputMode="numeric"
                maxLength={4}
              />
            </div>
          </div>
          <Button onClick={search} disabled={!code || last4.length !== 4 || searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {t("status.search")}
          </Button>
        </CardContent>
      </Card>

      {searched && !result && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
            <CalendarX className="h-8 w-8" />
            <p>{t("status.notFound")}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("status.details")}</CardTitle>
              <Badge variant={STATUS_VARIANT[result.status] ?? "outline"} className="capitalize">
                {result.status.replace("_", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Row label={t("status.patient")} value={result.fullName} />
            <Row label={t("status.contact")} value={`${result.email} · ${result.phone}`} />
            <Row
              label={t("booking.date")}
              value={format(new Date(result.preferredDate), "EEE, d MMM yyyy")}
            />
            <Row
              label={t("booking.time")}
              value={TIME_SLOTS.find((s) => s.key === result.preferredTimeSlot)?.label ?? result.preferredTimeSlot}
            />
            <Row
              label={t("booking.service")}
              value={SERVICES.find((s) => s.key === result.serviceKey)?.label ?? result.serviceKey}
            />

            {result.status !== "cancelled" && result.status !== "completed" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="mt-2">
                    {t("status.cancel")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("status.cancel")}</DialogTitle>
                    <DialogDescription>{t("status.cancelReason")}</DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us why (optional but appreciated)"
                  />
                  <DialogFooter>
                    <Button variant="destructive" disabled={cancelling} onClick={cancel}>
                      {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Confirm cancellation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
