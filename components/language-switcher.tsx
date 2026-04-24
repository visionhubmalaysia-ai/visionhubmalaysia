"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className={className}>
      <Select value={locale} onValueChange={(v) => router.replace(pathname, { locale: v as Locale })}>
        <SelectTrigger className="h-9 w-[160px] gap-2 bg-background/60 backdrop-blur">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {locales.map((l) => (
            <SelectItem key={l} value={l}>
              {localeNames[l]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
