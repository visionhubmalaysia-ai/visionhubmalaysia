import { getTranslations } from "next-intl/server";
import { Eye } from "lucide-react";

export async function KeratoconusSection() {
  const t = await getTranslations();
  const lenses = [
    t("home.softKeratoconus"),
    t("home.rgpKeratoconus"),
    t("home.rgpCorneal"),
    t("home.rgpScleral"),
  ];
  return (
    <section className="relative overflow-hidden border-t bg-primary py-20 text-primary-foreground md:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, white 0.5px, transparent 0.5px), radial-gradient(circle at 80% 70%, white 0.5px, transparent 0.5px)",
          backgroundSize: "60px 60px, 80px 80px",
        }}
      />
      <div className="container relative grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]">
            <Eye className="h-3 w-3" />
            Specialty care
          </div>
          <h2 className="mt-5 font-display text-4xl leading-tight tracking-tight md:text-5xl">
            {t("home.keratoconusFocus")}
          </h2>
          <p className="mt-5 max-w-xl text-primary-foreground/85">{t("home.keratoconusDesc")}</p>
        </div>

        <ul className="grid gap-3">
          {lenses.map((l) => (
            <li
              key={l}
              className="flex items-center justify-between rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-5 py-4 backdrop-blur"
            >
              <span className="font-medium">{l}</span>
              <span className="text-xs uppercase tracking-widest text-primary-foreground/60">Available</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
