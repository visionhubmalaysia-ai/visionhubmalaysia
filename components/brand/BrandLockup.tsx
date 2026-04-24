import { cn } from "@/lib/utils";

export function BrandLockup({ className, variant = "full" }: { className?: string; variant?: "full" | "compact" }) {
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
        <EyeMark className="h-6 w-6" />
        <span>VISION HUB</span>
      </div>
    );
  }
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <EyeMark className="h-10 w-10 text-primary" />
      <div className="leading-tight">
        <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Seed × Topcon Healthcare
        </div>
        <div className="font-display text-xl font-semibold tracking-tight">VISION HUB</div>
      </div>
    </div>
  );
}

export function EyeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="eye-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="hsl(var(--primary))" />
          <stop offset="1" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <path
        d="M20 8c7.2 0 13.3 4.6 16 12-2.7 7.4-8.8 12-16 12S6.7 27.4 4 20C6.7 12.6 12.8 8 20 8z"
        stroke="url(#eye-g)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="5.5" fill="url(#eye-g)" />
      <circle cx="22" cy="18" r="1.4" fill="hsl(var(--background))" />
    </svg>
  );
}
