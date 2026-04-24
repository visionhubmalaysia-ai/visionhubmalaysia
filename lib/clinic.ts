export const CLINIC = {
  brand: {
    full: "SEED X TOPCON Healthcare VISION HUB",
    short: "VISION HUB",
    subtitle: "Experience & Training Center",
  },
  address: {
    line1: "38, Jalan Puteri 5/8",
    line2: "Bandar Puteri Puchong",
    postal: "47100 Puchong, Selangor",
    country: "Malaysia",
    full: "38, Jalan Puteri 5/8, Bandar Puteri Puchong, 47100 Puchong, Selangor",
  },
  phone: "018-2138476",
  phoneIntl: "+60182138476",
  email: "visionhubmalaysia@gmail.com",
  hours: {
    days: "Monday - Friday",
    open: "10:00 AM",
    close: "5:30 PM",
    sessionDurationHours: 2,
    appointmentOnly: true,
  },
  social: {
    instagram: "https://www.instagram.com/visionhubmalaysia",
    whatsapp:
      "https://wa.me/+60182138476?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20eye%20care%20services%20at%20VISION%20HUB.",
  },
  maps: {
    google:
      "https://www.google.com/maps/search/?api=1&query=38%2C+Jalan+Puteri+5%2F8%2C+Bandar+Puteri+Puchong%2C+47100+Puchong%2C+Selangor",
    waze: "https://waze.com/ul?q=38,+Jalan+Puteri+5/8,+Bandar+Puteri+Puchong,+47100+Puchong,+Selangor",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.3!2d101.616!3d3.019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1",
  },
} as const;

export const TIME_SLOTS = [
  { key: "morning", label: "10:00 AM – 1:00 PM", start: "10:00", end: "13:00" },
  { key: "afternoon", label: "1:30 PM – 5:30 PM", start: "13:30", end: "17:30" },
] as const;

export type TimeSlotKey = (typeof TIME_SLOTS)[number]["key"];

export const SERVICES = [
  { key: "short_sighted", category: "screening", label: "Eye Screening — Short-sighted", price: 30 },
  { key: "long_sighted", category: "screening", label: "Eye Screening — Long-sighted", price: 30 },
  { key: "presbyopia", category: "screening", label: "Eye Screening — Presbyopia", price: 30 },
  { key: "dry_eyes", category: "screening", label: "Eye Screening — Dry Eyes", price: 30 },
  { key: "keratoconus", category: "screening", label: "Eye Screening — Keratoconus", price: 30 },
  { key: "low_vision", category: "specialized", label: "Low Vision Assessment", price: 40 },
  { key: "corneal_topography", category: "specialized", label: "Corneal Topography", price: 80 },
  { key: "color_vision", category: "screening", label: "Color Vision Test — Ishihara", price: 30 },
  { key: "basic_contact", category: "contact_lens", label: "Basic Contact Lens Fitting", price: 35 },
  { key: "advanced_contact", category: "contact_lens", label: "Advanced Contact Lens Fitting", price: 100 },
  { key: "after_care", category: "contact_lens", label: "After Care / Follow Up (Slit Lamp)", price: 35 },
  { key: "contact_experience", category: "contact_lens", label: "Contact Lens Experience", price: 0 },
] as const;

export const TRAINING_OPTIONS = [
  { key: "soft_sphere_astigmatism", label: "Soft Contact Lens — Sphere & Astigmatism" },
  { key: "soft_presbyopia", label: "Soft Contact Lens — Presbyopia (1daypure EDOF)" },
  { key: "soft_keratoconus", label: "Soft Contact Lens — Keratoconus" },
  { key: "rgp_keratoconus", label: "RGP Keratoconus Contact Lenses" },
  { key: "rgp_corneal_scleral", label: "RGP Corneal Scleral Lenses" },
  { key: "rgp_mini_scleral", label: "RGP Mini Scleral Lenses" },
  { key: "rgp_scleral", label: "RGP Scleral Lenses" },
  { key: "ortho_k", label: "Ortho-K Lenses" },
  { key: "other", label: "Other" },
] as const;
