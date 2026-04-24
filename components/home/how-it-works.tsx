import { getTranslations } from "next-intl/server";
import { CalendarCheck, Eye, Sparkles } from "lucide-react";

export async function HowItWorks() {
  const t = await getTranslations();
  const steps = [
    {
      n: "01",
      icon: CalendarCheck,
      title: t("home.bookAppointment"),
      desc: "Choose a 2-hour slot online. Weekdays 10 AM – 5:30 PM.",
    },
    {
      n: "02",
      icon: Eye,
      title: "Visit the hub",
      desc: "Your dedicated optometrist performs screening with TOPCON MYAH and specialty lens fitting.",
    },
    {
      n: "03",
      icon: Sparkles,
      title: "Follow-up care",
      desc: "Detailed report, personalized recommendations, and after-care with slit lamp review.",
    },
  ];

  return (
    <section className="border-t py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">Three steps to clearer vision.</h2>
        </div>
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-2xl border p-7">
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl text-muted-foreground">{s.n}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
