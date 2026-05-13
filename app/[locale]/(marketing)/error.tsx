"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[marketing] route error", error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-3xl tracking-tight">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">
          We couldn&apos;t load this page. This is usually a temporary connection issue — try again in a moment.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground/70">
            Reference: {error.digest}
          </p>
        )}
      </div>
      <Button onClick={reset}>
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
