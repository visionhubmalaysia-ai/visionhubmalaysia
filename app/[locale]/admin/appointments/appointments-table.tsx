"use client";

import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Search, RefreshCw, Loader2, CalendarClock, UserCog, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  assignOptometrist,
  deleteAppointment,
  listAppointments,
  updateAppointment,
} from "@/app/actions/admin";
import { TIME_SLOTS } from "@/lib/clinic";
import type { Appointment, Optometrist } from "@/db/schema";

const STATUS_VARIANT: Record<string, "default" | "success" | "destructive" | "secondary" | "outline" | "accent"> = {
  pending: "outline",
  confirmed: "success",
  cancelled: "destructive",
  completed: "secondary",
  no_show: "destructive",
};

export function AppointmentsTable({
  initialRows,
  optometrists,
  initialStatus,
  initialSearch,
}: {
  initialRows: Appointment[];
  optometrists: Optometrist[];
  initialStatus: string;
  initialSearch: string;
}) {
  const [rows, setRows] = useState(initialRows);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState(initialSearch);
  const [refreshing, startRefresh] = useTransition();

  const [editing, setEditing] = useState<Appointment | null>(null);
  const [assignFor, setAssignFor] = useState<Appointment | null>(null);

  const refresh = () =>
    startRefresh(async () => {
      const { appointments } = await listAppointments({ status: status === "all" ? undefined : status, search });
      setRows(appointments);
    });

  const filtered = useMemo(() => rows, [rows]);

  return (
    <>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, phone, email, code…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && refresh()}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No-show</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Optometrist</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                  No appointments match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => {
                const opto = optometrists.find((o) => o.id === a.optometristId);
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.appointmentCode}</TableCell>
                    <TableCell>
                      <div className="font-medium">{a.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {a.email} · {a.phone}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(a.preferredDate), "d MMM yyyy")}</TableCell>
                    <TableCell>
                      {TIME_SLOTS.find((s) => s.key === a.preferredTimeSlot)?.label ?? a.preferredTimeSlot}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[a.status] ?? "outline"} className="capitalize">
                        {a.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {opto ? (
                        <span className="text-sm">{opto.fullName}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditing(a)}>
                          <CalendarClock className="h-4 w-4" /> Reschedule
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setAssignFor(a)}>
                          <UserCog className="h-4 w-4" /> Assign
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            if (!confirm(`Delete appointment for ${a.fullName}?`)) return;
                            await deleteAppointment(a.id);
                            setRows((r) => r.filter((x) => x.id !== a.id));
                            toast.success("Deleted");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {editing && (
        <RescheduleDialog
          appointment={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setRows((r) => r.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)));
            setEditing(null);
          }}
        />
      )}
      {assignFor && (
        <AssignDialog
          appointment={assignFor}
          optometrists={optometrists}
          onClose={() => setAssignFor(null)}
          onSaved={(optoId) => {
            setRows((r) => r.map((x) => (x.id === assignFor.id ? { ...x, optometristId: optoId } : x)));
            setAssignFor(null);
          }}
        />
      )}
    </>
  );
}

function RescheduleDialog({
  appointment,
  onClose,
  onSaved,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSaved: (a: Partial<Appointment> & { id: string }) => void;
}) {
  const [date, setDate] = useState(appointment.preferredDate);
  const [slot, setSlot] = useState(appointment.preferredTimeSlot);
  const [statusVal, setStatusVal] = useState<Appointment["status"]>(appointment.status);
  const [saving, start] = useTransition();

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update appointment</DialogTitle>
          <DialogDescription>{appointment.fullName} · {appointment.appointmentCode}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Slot</Label>
            <Select value={slot} onValueChange={(v) => setSlot(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_SLOTS.map((s) => (
                  <SelectItem key={s.key} value={s.key}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={statusVal} onValueChange={(v) => setStatusVal(v as Appointment["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["pending", "confirmed", "completed", "cancelled", "no_show"] as const).map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={saving}
            onClick={() =>
              start(async () => {
                try {
                  await updateAppointment({ id: appointment.id, preferredDate: date, preferredTimeSlot: slot, status: statusVal });
                  onSaved({ id: appointment.id, preferredDate: date, preferredTimeSlot: slot, status: statusVal });
                  toast.success("Updated");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              })
            }
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssignDialog({
  appointment,
  optometrists,
  onClose,
  onSaved,
}: {
  appointment: Appointment;
  optometrists: Optometrist[];
  onClose: () => void;
  onSaved: (optoId: string | null) => void;
}) {
  const [pick, setPick] = useState<string>(appointment.optometristId ?? "");
  const [saving, start] = useTransition();
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign optometrist</DialogTitle>
          <DialogDescription>{appointment.fullName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label>Optometrist</Label>
          <Select value={pick} onValueChange={setPick}>
            <SelectTrigger>
              <SelectValue placeholder="Choose one…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">— Unassign —</SelectItem>
              {optometrists.filter((o) => o.active).map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            disabled={saving}
            onClick={() =>
              start(async () => {
                try {
                  const opto = pick || null;
                  await assignOptometrist({ appointmentId: appointment.id, optometristId: opto });
                  onSaved(opto);
                  toast.success("Assigned");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Failed");
                }
              })
            }
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
