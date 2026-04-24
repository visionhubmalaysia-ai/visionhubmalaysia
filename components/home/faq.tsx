import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do you accept walk-in customers?",
    a: "No. VISION HUB is by appointment only so each patient gets a dedicated optometrist and uninterrupted 2-hour consultation.",
  },
  {
    q: "What happens to my personal data?",
    a: "We comply with Malaysia's Personal Data Protection Act 2024. Your data is used only for appointment scheduling, service delivery, and healthcare record-keeping. You can withdraw consent or request deletion at any time.",
  },
  {
    q: "Can I get a sponsored consultation?",
    a: "Yes — sponsored/waived consultations are available in selected cases. Tell us the reason during booking and we'll confirm eligibility.",
  },
  {
    q: "Are weekends available?",
    a: "Weekends require advance booking. Use the booking page to request a date and we'll confirm by WhatsApp.",
  },
  {
    q: "What technology do you use?",
    a: "TOPCON MYAH for axial length and myopia tracking, corneal topography, and a full specialty contact lens range including Ortho-K, Scleral, and RGP lenses.",
  },
  {
    q: "How do I cancel or reschedule?",
    a: "Use the Check Status page with your appointment code and the last 4 digits of the phone number you booked with.",
  },
];

export function Faq() {
  return (
    <section className="border-t py-20 md:py-28">
      <div className="container grid gap-10 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">FAQ</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">Good to know.</h2>
          <p className="mt-4 text-muted-foreground">
            Everything about visiting VISION HUB — consent, policies, and the tech behind our consultations.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
