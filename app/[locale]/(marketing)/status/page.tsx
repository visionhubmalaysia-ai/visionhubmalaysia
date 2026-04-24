import { setRequestLocale } from "next-intl/server";
import { StatusLookup } from "./status-lookup";

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { locale } = await params;
  const { code } = await searchParams;
  setRequestLocale(locale);
  return (
    <div className="pt-28 pb-20">
      <div className="container max-w-2xl">
        <StatusLookup initialCode={code ?? ""} />
      </div>
    </div>
  );
}
