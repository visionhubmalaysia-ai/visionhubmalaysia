"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { addMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SERVICES, TIME_SLOTS } from "@/lib/clinic";
import { createAppointment, getMonthSlots } from "@/app/actions/public";
import type { DaySlot } from "@/lib/slots";
import { cn, lastFour } from "@/lib/utils";

type Step = "slot" | "details" | "consent" | "done";

type BookingResult = { code: string; phoneLast4: string; date: string; slot: string; name: string };

export function BookingWizard() {
  const t = useTranslations();
  const [step, setStep] = useState<Step>("slot");
  const [monthOffset, setMonthOffset] = useState(0);
  const [days, setDays] = useState<DaySlot[]>([]);
  const [loadingSlots, startSlotLoad] = useTransition();
  const [selected, setSelected] = useState<{ date: string; slotKey: string } | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    countryCode: "+60",
    phone: "",
    serviceKey: "",
    sponsored: false,
    sponsorReason: "",
    notes: "",
  });
  const [consents, setConsents] = useState({
    dataCollection: false,
    dataProcessing: false,
    dataStorage: false,
    dataSharing: false,
    marketingCommunication: false,
    dataRetention: false,
  });
  const [submitting, startSubmit] = useTransition();

  useEffect(() => {
    startSlotLoad(async () => {
      const res = await getMonthSlots(monthOffset);
      setDays(res.availableSlots);
    });
  }, [monthOffset]);

  const monthLabel = format(addMonths(new Date(), monthOffset), "MMMM yyyy");

  const weeks = useMemo(() => chunkIntoWeeks(days), [days]);

  const requiredConsentsOk = consents.dataCollection && consents.dataProcessing && consents.dataStorage;
  const detailsValid =
    form.fullName.trim().length >= 2 &&
    /.+@.+\..+/.test(form.email) &&
    form.phone.replace(/\D/g, "").length >= 5 &&
    form.serviceKey;

  async function submit() {
    if (!selected) return;
    startSubmit(async () => {
      try {
        const res = await createAppointment({
          ...form,
          preferredDate: selected.date,
          preferredTimeSlot: selected.slotKey as "morning" | "afternoon",
          pdpaConsents: consents,
        });
        setResult({
          code: res.appointment.code,
          phoneLast4: lastFour(form.phone),
          date: selected.date,
          slot: TIME_SLOTS.find((s) => s.key === selected.slotKey)?.label ?? "",
          name: form.fullName,
        });
        setStep("done");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Something went wrong.");
      }
    });
  }

  if (step === "done" && result) {
    return <DoneCard result={result} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-8">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t("header.bookingTitle")}
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">{t("booking.appointmentDetails")}</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">{t("booking.fillDetails")}</p>
        </header>

        <Stepper current={step} />

        {step === "slot" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("booking.availableSlots")}</CardTitle>
                <CardDescription>{t("booking.slotsDescription")}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setMonthOffset((m) => Math.max(0, m - 1))} disabled={monthOffset === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="w-36 text-center text-sm font-medium">{monthLabel}</span>
                <Button variant="outline" size="icon" onClick={() => setMonthOffset((m) => m + 1)} disabled={monthOffset >= 2}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("booking.loading")}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="hidden grid-cols-7 gap-2 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground md:grid">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>
                  {weeks.map((w, wi) => (
                    <div key={wi} className="grid grid-cols-1 gap-2 md:grid-cols-7">
                      {w.map((d, di) => (
                        <DayCell
                          key={di}
                          day={d}
                          selected={d && selected?.date === d.date ? selected.slotKey : null}
                          onPick={(slotKey) => {
                            if (d) setSelected({ date: d.date, slotKey });
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex items-center justify-between">
                <Legend />
                <Button disabled={!selected} onClick={() => setStep("details")}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "details" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("booking.appointmentDetails")}</CardTitle>
              <CardDescription>{t("booking.fillDetails")}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <Field label={t("booking.fullName")} required>
                <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
              </Field>
              <div className="grid gap-5 md:grid-cols-[140px_1fr]">
                <Field label="Code">
                  <Select value={form.countryCode} onValueChange={(v) => setForm((f) => ({ ...f, countryCode: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+60">🇲🇾 +60</SelectItem>
                      <SelectItem value="+65">🇸🇬 +65</SelectItem>
                      <SelectItem value="+62">🇮🇩 +62</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={t("booking.phone")} required>
                  <Input
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="12 345 6789"
                  />
                </Field>
              </div>
              <Field label={t("booking.email")} required>
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </Field>
              <Field label={t("booking.service")} required>
                <Select value={form.serviceKey} onValueChange={(v) => setForm((f) => ({ ...f, serviceKey: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("booking.selectService")} />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICES.map((s) => (
                      <SelectItem key={s.key} value={s.key}>
                        {s.label} {s.price > 0 ? `· RM${s.price}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
                <Checkbox
                  id="sponsored"
                  checked={form.sponsored}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, sponsored: Boolean(v) }))}
                />
                <div className="flex-1">
                  <Label htmlFor="sponsored" className="font-medium">
                    {t("booking.sponsored")}
                  </Label>
                  {form.sponsored && (
                    <Textarea
                      className="mt-3"
                      placeholder="Brief reason (e.g. student, community program)"
                      value={form.sponsorReason}
                      onChange={(e) => setForm((f) => ({ ...f, sponsorReason: e.target.value }))}
                    />
                  )}
                </div>
              </div>
              <Field label={t("booking.additionalNotes")}>
                <Textarea
                  value={form.notes}
                  placeholder={t("booking.notesPlaceholder")}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </Field>
              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep("slot")}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button disabled={!detailsValid} onClick={() => setStep("consent")}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "consent" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("pdpa.title")}</CardTitle>
              <CardDescription>{t("pdpa.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ConsentRow
                label={t("pdpa.collection")}
                desc={t("pdpa.collectionDesc")}
                required
                checked={consents.dataCollection}
                onChange={(v) => setConsents((c) => ({ ...c, dataCollection: v }))}
              />
              <ConsentRow
                label={t("pdpa.processing")}
                desc={t("pdpa.processingDesc")}
                required
                checked={consents.dataProcessing}
                onChange={(v) => setConsents((c) => ({ ...c, dataProcessing: v }))}
              />
              <ConsentRow
                label={t("pdpa.storage")}
                desc={t("pdpa.storageDesc")}
                required
                checked={consents.dataStorage}
                onChange={(v) => setConsents((c) => ({ ...c, dataStorage: v }))}
              />
              <Separator />
              <p className="text-sm font-medium">{t("pdpa.optional")}</p>
              <ConsentRow
                label={t("pdpa.sharing")}
                desc={t("pdpa.sharingDesc")}
                checked={consents.dataSharing}
                onChange={(v) => setConsents((c) => ({ ...c, dataSharing: v }))}
              />
              <ConsentRow
                label={t("pdpa.marketing")}
                desc={t("pdpa.marketingDesc")}
                checked={consents.marketingCommunication}
                onChange={(v) => setConsents((c) => ({ ...c, marketingCommunication: v }))}
              />
              <ConsentRow
                label={t("pdpa.retention")}
                desc={t("pdpa.retentionDesc")}
                checked={consents.dataRetention}
                onChange={(v) => setConsents((c) => ({ ...c, dataRetention: v }))}
              />

              <div className="flex justify-between pt-2">
                <Button variant="ghost" onClick={() => setStep("details")}>
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
                <Button disabled={!requiredConsentsOk || submitting} onClick={submit}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  {t("booking.bookButton")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("booking.selectedSlot")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {selected ? (
              <>
                <SummaryRow label={t("booking.date")} value={format(new Date(selected.date), "EEE, d MMM yyyy")} />
                <SummaryRow label={t("booking.time")} value={TIME_SLOTS.find((s) => s.key === selected.slotKey)?.label ?? ""} />
                {form.serviceKey && (
                  <SummaryRow
                    label={t("booking.service")}
                    value={SERVICES.find((s) => s.key === form.serviceKey)?.label ?? ""}
                  />
                )}
                {form.fullName && <SummaryRow label={t("booking.fullName")} value={form.fullName} />}
              </>
            ) : (
              <p className="text-muted-foreground">{t("booking.selectSlot")}</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">{t("booking.importantNotice")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <p>· {t("booking.notice1")}</p>
            <p>· {t("booking.notice2")}</p>
            <p>· {t("booking.notice3")}</p>
            <p>· {t("booking.notice4")}</p>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function Stepper({ current }: { current: Step }) {
  const steps: { key: Step; label: string }[] = [
    { key: "slot", label: "Slot" },
    { key: "details", label: "Details" },
    { key: "consent", label: "Consent" },
  ];
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <ol className="flex items-center gap-2 text-xs">
      {steps.map((s, i) => (
        <li key={s.key} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full border",
              i < idx
                ? "border-primary bg-primary text-primary-foreground"
                : i === idx
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground",
            )}
          >
            {i + 1}
          </span>
          <span className={cn(i <= idx ? "font-medium" : "text-muted-foreground")}>{s.label}</span>
          {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
        </li>
      ))}
    </ol>
  );
}

function DayCell({
  day,
  selected,
  onPick,
}: {
  day: DaySlot | null;
  selected: string | null;
  onPick: (slotKey: string) => void;
}) {
  if (!day) return <div className="hidden md:block" />;
  const d = new Date(day.date);
  const disabled = !day.isWeekday || day.isBlocked;

  return (
    <div
      className={cn(
        "rounded-lg border p-2.5",
        disabled ? "bg-muted/40 opacity-70" : "bg-background",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground md:hidden">
            {format(d, "EEE")}
          </div>
          <div className="text-sm font-semibold">{format(d, "d")}</div>
        </div>
        {disabled && (
          <Badge variant="outline" className="text-[10px]">
            {day.isBlocked ? "Closed" : "—"}
          </Badge>
        )}
      </div>
      <div className="mt-2 space-y-1">
        {day.timeSlots.map((s) => {
          const isSelected = selected === s.key;
          return (
            <button
              key={s.key}
              type="button"
              disabled={!s.available}
              onClick={() => onPick(s.key)}
              className={cn(
                "block w-full rounded-md border px-2 py-1 text-left text-[11px] transition",
                !s.available && "cursor-not-allowed bg-muted text-muted-foreground line-through",
                s.available && !isSelected && "hover:border-primary hover:bg-primary/5",
                isSelected && "border-primary bg-primary text-primary-foreground",
              )}
            >
              {s.label.replace(" – ", "–")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex gap-4 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm bg-primary" /> Available
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-sm bg-muted" /> Booked / Closed
      </span>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function ConsentRow({
  label,
  desc,
  required,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  required?: boolean;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Label className="font-medium">{label}</Label>
          {required && <Badge variant="outline" className="text-[10px]">Required</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function DoneCard({ result }: { result: BookingResult }) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <CardTitle className="mt-4 font-display text-3xl">Booking received</CardTitle>
        <CardDescription>
          Hi {result.name}, your request for {format(new Date(result.date), "EEE, d MMM")} · {result.slot} is pending confirmation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/30 p-4 text-sm">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Appointment code</div>
          <div className="mt-1 font-mono text-xl font-semibold">{result.code}</div>
          <p className="mt-3 text-xs text-muted-foreground">
            Save this, along with the last 4 digits of your phone (<b>{result.phoneLast4}</b>) — you'll need both to check status or cancel.
          </p>
        </div>
        <Button asChild className="w-full">
          <a href={`/status?code=${result.code}`}>View status</a>
        </Button>
      </CardContent>
    </Card>
  );
}

function chunkIntoWeeks(days: DaySlot[]): Array<Array<DaySlot | null>> {
  if (days.length === 0) return [];
  const first = new Date(days[0]!.date);
  // JS Sun=0; we want Mon=0 for grid
  const leadEmpty = (first.getDay() + 6) % 7;
  const padded: Array<DaySlot | null> = [
    ...Array.from({ length: leadEmpty }, () => null),
    ...days,
  ];
  while (padded.length % 7 !== 0) padded.push(null);
  const out: Array<Array<DaySlot | null>> = [];
  for (let i = 0; i < padded.length; i += 7) out.push(padded.slice(i, i + 7));
  return out;
}
