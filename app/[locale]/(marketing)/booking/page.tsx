import { setRequestLocale } from "next-intl/server";
import { BookingWizard } from "./booking-wizard";

export default async function BookingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pt-28 pb-20">
      <div className="container">
        <BookingWizard />
      </div>
    </div>
  );
}
