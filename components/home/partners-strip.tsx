export function PartnersStrip() {
  return (
    <section className="border-y bg-background">
      <div className="container flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-8 text-sm">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">In partnership with</span>
        <Wordmark>SEED</Wordmark>
        <span className="text-muted-foreground">×</span>
        <Wordmark>TOPCON</Wordmark>
        <span className="text-muted-foreground">×</span>
        <Wordmark>HEALTHCARE</Wordmark>
        <span className="text-muted-foreground">·</span>
        <Wordmark subtle>VISION HUB</Wordmark>
      </div>
    </section>
  );
}

function Wordmark({ children, subtle }: { children: React.ReactNode; subtle?: boolean }) {
  return (
    <span
      className={
        "font-display text-xl tracking-[0.08em] " +
        (subtle ? "text-muted-foreground" : "text-foreground")
      }
    >
      {children}
    </span>
  );
}
