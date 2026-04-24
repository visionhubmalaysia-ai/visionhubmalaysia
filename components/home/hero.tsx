"use client";

import { motion } from "framer-motion";
import { Calendar, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-grid bg-radial-fade opacity-30 dark:opacity-20" />
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[60vh]" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            SEED × TOPCON Healthcare · {t("home.subtitle")}
          </div>

          <h1 className="mt-7 text-balance font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
            {t("home.hero")}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            {t("home.heroDesc")}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href="/booking">
                <Calendar className="h-4 w-4" />
                {t("home.bookAppointment")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/status">{t("home.checkStatus")}</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              PDPA 2024 compliant
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              TOPCON MYAH technology
            </span>
            <span>From RM30 · 2-hour consultation</span>
          </div>
        </motion.div>

        <HeroArt />
      </div>
    </section>
  );
}

function HeroArt() {
  return (
    <div className="relative mx-auto mt-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative aspect-[2.1/1] overflow-hidden rounded-3xl border bg-gradient-to-br from-primary via-primary to-accent shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.18),transparent_50%)]" />

        <svg viewBox="0 0 800 380" className="h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="iris" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="0.5" stopColor="#bae6fd" stopOpacity="0.6" />
              <stop offset="1" stopColor="#1e3a8a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="rim" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* eye outline */}
          <path
            d="M60 190 C 200 60, 600 60, 740 190 C 600 320, 200 320, 60 190 Z"
            fill="none"
            stroke="url(#rim)"
            strokeWidth="1.5"
          />
          <path
            d="M110 190 C 230 100, 570 100, 690 190 C 570 280, 230 280, 110 190 Z"
            fill="#0b1e4b"
            opacity="0.35"
          />
          <circle cx="400" cy="190" r="95" fill="url(#iris)" />
          <circle cx="400" cy="190" r="34" fill="#0b1e4b" />
          <circle cx="388" cy="178" r="9" fill="#ffffff" opacity="0.9" />
          {/* scan lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1="80"
              y1={120 + i * 28}
              x2="720"
              y2={120 + i * 28}
              stroke="#ffffff"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* floating chips */}
        <div className="absolute left-6 top-6 rounded-xl bg-background/90 px-3 py-2 text-[11px] font-medium shadow-lg backdrop-blur">
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Topcon MYAH</div>
          <div className="mt-0.5 text-foreground">Axial length · 23.42 mm</div>
        </div>
        <div className="absolute right-6 top-10 rounded-xl bg-background/90 px-3 py-2 text-[11px] font-medium shadow-lg backdrop-blur">
          <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Corneal topography</div>
          <div className="mt-0.5 text-foreground">K1 43.2 / K2 44.1</div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur">
          Appointment confirmed · Thu 10:00 AM
        </div>
      </motion.div>
    </div>
  );
}
