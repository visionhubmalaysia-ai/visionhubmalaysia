import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Instagram, MessageCircle, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/lib/clinic";

export async function ContactSection() {
  const t = await getTranslations();
  return (
    <section id="contact" className="border-t py-20 md:py-28">
      <div className="container grid gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{t("home.contact")}</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">{t("home.ourLocation")}</h2>

          <div className="mt-8 space-y-5">
            <InfoRow icon={MapPin} label={t("home.address")} value={CLINIC.address.full} />
            <InfoRow icon={Phone} label={t("home.phone")} value={CLINIC.phone} href={`tel:${CLINIC.phone}`} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={CLINIC.maps.google} target="_blank" rel="noopener noreferrer">
                <MapPin className="h-4 w-4" />
                {t("home.openGoogleMaps")}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={CLINIC.maps.waze} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-4 w-4" />
                {t("home.openWaze")}
              </a>
            </Button>
            <Button asChild variant="accent">
              <a href={CLINIC.social.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                {t("home.chatWhatsApp")}
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href={CLINIC.social.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
                {t("home.followInstagram")}
              </a>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border shadow-sm">
          <iframe
            title="VISION HUB location"
            src="https://www.google.com/maps?q=38%2C+Jalan+Puteri+5%2F8%2C+Bandar+Puteri+Puchong%2C+47100+Puchong%2C+Selangor&output=embed"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, value, href }: { icon: typeof MapPin; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="mt-0.5 font-medium">{value}</div>
      </div>
    </div>
  );
  if (href) return <a href={href} className="block transition hover:opacity-80">{content}</a>;
  return content;
}
