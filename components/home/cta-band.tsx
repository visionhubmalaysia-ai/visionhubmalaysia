import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function CtaBand() {
  const t = await getTranslations();
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary to-accent p-10 text-primary-foreground md:p-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">{t("home.readyToBook")}</h2>
              <p className="mt-3 max-w-xl text-primary-foreground/85">{t("home.readyToBookDesc")}</p>
            </div>
            <Button asChild size="lg" variant="secondary" className="w-fit self-start md:self-center">
              <Link href="/booking">
                {t("home.bookNow")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
