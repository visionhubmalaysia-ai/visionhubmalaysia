"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarX2, Loader2, Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addBlockedDate, removeBlockedDate } from "@/app/actions/admin";
import type { BlockedDate } from "@/db/schema";

export function BlockedDatesPanel({ initial }: { initial: BlockedDate[] }) {
  const [rows, setRows] = useState(initial);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, start] = useTransition();

  return (
    <div className="grid gap-6 md:grid-cols-[420px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Block a date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Reason (optional)</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Public holiday, training…" />
          </div>
          <Button
            disabled={!date || saving}
            onClick={() =>
              start(async () => {
                try {
                  await addBlockedDate({ date, reason: reason || undefined });
                  toast.success("Date blocked");
                  setRows((r) => [{ id: crypto.randomUUID(), date, reason: reason || null, createdBy: null, createdAt: new Date() }, ...r]);
                  setDate("");
                  setReason("");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              })
            }
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Block date
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Currently blocked</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
              <CalendarX2 className="h-6 w-6" /> No blocked dates.
            </div>
          ) : (
            <ul className="divide-y">
              {rows.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{format(new Date(d.date), "EEE, d MMM yyyy")}</div>
                    {d.reason && <Badge variant="outline" className="mt-1">{d.reason}</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      if (!confirm(`Unblock ${format(new Date(d.date), "d MMM")}?`)) return;
                      await removeBlockedDate(d.id);
                      setRows((r) => r.filter((x) => x.id !== d.id));
                      toast.success("Unblocked");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
