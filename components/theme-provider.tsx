"use client";
import { ThemeProvider as NextThemes } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemes {...props}>{children}</NextThemes>;
}
