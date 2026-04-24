import { getTranslations } from "next-intl/server";
import { Stethoscope, GraduationCap, Users, CheckCircle2 } from "lucide-react";

export async function Pillars() {
  const t = await getTranslations();

  const pillars = [
    {
      icon: Stethoscope,
      title: t("home.screening"),
      desc: t("home.screeningDesc"),
      points: [t("home.screeningPoint1"), t("home.screeningPoint2"), t("home.screeningPoint3")],
      hue: "primary" as const,
    },
    {
      icon: GraduationCap,
      title: t("home.academic"),
      desc: t("home.academicDesc"),
      points: [
        t("home.academicPoint1"),
        t("home.academicPoint2"),
        t("home.academicPoint3"),
        t("home.academicPoint4"),
      ],
      hue: "accent" as const,
    },
    {
      icon: Users,
      title: t("home.training"),
      desc: t("home.trainingDesc"),
      points: [
        t("home.trainingPoint1"),
        t("home.trainingPoint2"),
        t("home.trainingPoint3"),
        t("home.trainingPoint4"),
      ],
      hue: "primary" as const,
    },
  ];

  return (
    <section id="about" className="border-t bg-muted/30 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">S.A.T.</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">{t("home.objective")}</h2>
          <p className="mt-4 text-muted-foreground">{t("home.objectiveDesc")}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <article
              key={i}
              className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={
                  p.hue === "accent"
                    ? "mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent"
                    : "mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
                }
              >
                <p.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-2xl tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {p.points.map((pt, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-foreground/80">{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="pointer-events-none absolute inset-x-0 -bottom-6 h-20 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
