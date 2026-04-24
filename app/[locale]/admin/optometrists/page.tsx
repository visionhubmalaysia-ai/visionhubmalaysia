import { listOptometrists } from "@/app/actions/admin";
import { OptometristPanel } from "./optometrist-panel";

export const dynamic = "force-dynamic";

export default async function OptometristsPage() {
  const { optometrists } = await listOptometrists();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl tracking-tight">Optometrists</h1>
        <p className="text-sm text-muted-foreground">Manage your clinical team and their duty days.</p>
      </header>
      <OptometristPanel initial={optometrists} />
    </div>
  );
}
