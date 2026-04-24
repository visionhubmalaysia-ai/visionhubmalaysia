import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Instagram, MessageCircle, Phone, MapPin } from "lucide-react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { CLINIC } from "@/lib/clinic";

export async function SiteFooter() {
  const t = await getTranslations();
  return (
    <footer className="border-t bg-muted/30">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLockup />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t("home.heroDesc")}</p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={CLINIC.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 transition hover:bg-emerald-500/20"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href={CLINIC.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent transition hover:bg-accent/20"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={`tel:${CLINIC.phone}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary/20"
              aria-label="Phone"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("home.ourLocation")}</h4>
          <div className="mt-3 flex gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{CLINIC.address.full}</span>
          </div>
          <div className="mt-4 space-y-1 text-sm">
            <p className="text-muted-foreground">{t("home.operatingDays")}</p>
            <p>{CLINIC.hours.days}</p>
            <p className="text-muted-foreground">
              {CLINIC.hours.open} – {CLINIC.hours.close}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">{t("home.contactUs")}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={`tel:${CLINIC.phone}`} className="text-muted-foreground hover:text-foreground">
                {CLINIC.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${CLINIC.email}`} className="text-muted-foreground hover:text-foreground">
                {CLINIC.email}
              </a>
            </li>
            <li>
              <Link href="/booking" className="text-muted-foreground hover:text-foreground">
                {t("home.bookAppointment")}
              </Link>
            </li>
            <li>
              <Link href="/status" className="text-muted-foreground hover:text-foreground">
                {t("home.checkStatus")}
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {CLINIC.brand.full}. All rights reserved.</p>
          <p>PDPA 2024 compliant · Made in Malaysia</p>
        </div>
      </div>
    </footer>
  );
}
