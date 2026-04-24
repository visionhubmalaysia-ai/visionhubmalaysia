import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMyr(amount: number | string) {
  const n = typeof amount === "string" ? parseInt(amount, 10) : amount;
  return `RM${n}`;
}

export function lastFour(phone: string) {
  return phone.replace(/\D/g, "").slice(-4);
}

export function appointmentCodeFrom(phone: string) {
  return phone.replace(/\D/g, "");
}
