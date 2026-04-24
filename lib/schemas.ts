import { z } from "zod";

export const pdpaConsentSchema = z.object({
  dataCollection: z.boolean(),
  dataProcessing: z.boolean(),
  dataStorage: z.boolean(),
  dataSharing: z.boolean().optional().default(false),
  marketingCommunication: z.boolean().optional().default(false),
  dataRetention: z.boolean().optional().default(false),
});

export const createAppointmentSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  countryCode: z.string().default("+60"),
  phone: z.string().min(5),
  serviceKey: z.string().min(1),
  trainingKeys: z.array(z.string()).optional(),
  trainingOther: z.string().optional(),
  sponsored: z.boolean().default(false),
  sponsorReason: z.string().optional(),
  notes: z.string().optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTimeSlot: z.enum(["morning", "afternoon"]),
  pdpaConsents: pdpaConsentSchema.refine(
    (c) => c.dataCollection && c.dataProcessing && c.dataStorage,
    { message: "Required PDPA consents are missing" },
  ),
});
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const lookupAppointmentSchema = z.object({
  appointmentCode: z.string().min(4),
  phoneLast4: z.string().length(4),
});

export const cancelAppointmentSchema = z.object({
  appointmentCode: z.string().min(4),
  phoneLast4: z.string().length(4),
  reason: z.string().min(3),
});

export const availabilitySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const optometristInputSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const blockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  id: z.string().uuid(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  preferredTimeSlot: z.enum(["morning", "afternoon"]).optional(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"]).optional(),
  notes: z.string().optional(),
});

export const assignOptometristSchema = z.object({
  appointmentId: z.string().uuid(),
  optometristId: z.string().uuid().nullable(),
});

export const dutyDaySchema = z.object({
  optometristId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  shift: z.enum(["morning", "afternoon", "full"]).default("full"),
  note: z.string().optional(),
});
