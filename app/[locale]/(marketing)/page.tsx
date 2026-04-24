import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/hero";
import { PartnersStrip } from "@/components/home/partners-strip";
import { Pillars } from "@/components/home/pillars";
import { ServicesSection } from "@/components/home/services";
import { HowItWorks } from "@/components/home/how-it-works";
import { KeratoconusSection } from "@/components/home/keratoconus";
import { ContactSection } from "@/components/home/contact";
import { Faq } from "@/components/home/faq";
import { CtaBand } from "@/components/home/cta-band";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <PartnersStrip />
      <Pillars />
      <ServicesSection />
      <HowItWorks />
      <KeratoconusSection />
      <ContactSection />
      <Faq />
      <CtaBand />
    </>
  );
}
