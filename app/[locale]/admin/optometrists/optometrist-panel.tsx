"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Power } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { addOptometrist, toggleOptometristActive, updateOptometrist } from "@/app/actions/admin";
import type { Optometrist } from "@/db/schema";

type FormState = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
  avatarUrl: string;
};

const emptyForm: FormState = { fullName: "", email: "", phone: "", specialization: "", bio: "", avatarUrl: "" };

export function OptometristPanel({ initial }: { initial: Optometrist[] }) {
  const [rows, setRows] = useState(initial);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, start] = useTransition();

  const save = () =>
    start(async () => {
      if (!form) return;
      try {
        if (form.id) {
          await updateOptometrist({ id: form.id, ...stripForm(form) });
          setRows((r) => r.map((o) => (o.id === form.id ? { ...o, ...stripForm(form) } : o)));
          toast.success("Updated");
        } else {
          const { optometrist } = await addOptometrist(stripForm(form));
          setRows((r) => [optometrist, ...r]);
          toast.success("Added");
        }
        setForm(null);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed");
      }
    });

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} total</p>
        <Button onClick={() => setForm(emptyForm)}>
          <Plus className="h-4 w-4" /> Add optometrist
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rows.map((o) => (
          <Card key={o.id} className={o.active ? "" : "opacity-60"}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-base">{o.fullName}</CardTitle>
                {o.specialization && <p className="mt-1 text-xs text-muted-foreground">{o.specialization}</p>}
              </div>
              <Badge variant={o.active ? "success" : "outline"}>{o.active ? "Active" : "Inactive"}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {o.email && <p className="text-muted-foreground">{o.email}</p>}
              {o.phone && <p className="text-muted-foreground">{o.phone}</p>}
              {o.bio && <p className="line-clamp-3 text-xs text-muted-foreground">{o.bio}</p>}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setForm({
                      id: o.id,
                      fullName: o.fullName,
                      email: o.email ?? "",
                      phone: o.phone ?? "",
                      specialization: o.specialization ?? "",
                      bio: o.bio ?? "",
                      avatarUrl: o.avatarUrl ?? "",
                    })
                  }
                >
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await toggleOptometristActive(o.id, !o.active);
                    setRows((r) => r.map((x) => (x.id === o.id ? { ...x, active: !o.active } : x)));
                  }}
                >
                  <Power className="h-4 w-4" /> {o.active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {form && (
        <Dialog open onOpenChange={(o) => !o && setForm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{form.id ? "Edit optometrist" : "New optometrist"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <Field label="Full name">
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </Field>
              <Field label="Specialization">
                <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email">
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
                <Field label="Phone">
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </Field>
              </div>
              <Field label="Bio">
                <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </Field>
              <Field label="Avatar URL">
                <Input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
              </Field>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setForm(null)}>Cancel</Button>
              <Button disabled={!form.fullName || saving} onClick={save}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function stripForm(f: FormState) {
  const { id: _id, ...rest } = f;
  return rest;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
