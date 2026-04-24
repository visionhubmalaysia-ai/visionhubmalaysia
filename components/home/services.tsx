"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/lib/clinic";
import { ArrowUpRight } from "lucide-react";

export function ServicesSection() {
  const t = useTranslations();
  const byCat = {
    screening: SERVICES.filter((s) => s.category === "screening"),
    contact_lens: SERVICES.filter((s) => s.category === "contact_lens"),
    specialized: SERVICES.filter((s) => s.category === "specialized"),
  };

  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t("home.services")}
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
              Eye care, tailored to you.
            </h2>
          </div>
          <Button asChild variant="link" className="hidden md:inline-flex">
            <Link href="/booking">
              {t("home.bookNow")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="screening" className="mt-10">
          <TabsList>
            <TabsTrigger value="screening">Eye Screening</TabsTrigger>
            <TabsTrigger value="contact_lens">Contact Lenses</TabsTrigger>
            <TabsTrigger value="specialized">Specialized</TabsTrigger>
          </TabsList>

          {(Object.keys(byCat) as Array<keyof typeof byCat>).map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid gap-3 md:grid-cols-2">
                {byCat[cat].map((s) => (
                  <Link
                    key={s.key}
                    href="/booking"
                    className="group flex items-center justify-between rounded-xl border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                  >
                    <div>
                      <div className="font-medium">{s.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Dedicated optometrist · 2h session</div>
                    </div>
                    <div className="flex items-center gap-3 text-primary">
                      <span className="font-semibold">{s.price > 0 ? `RM${s.price}` : "Free"}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
