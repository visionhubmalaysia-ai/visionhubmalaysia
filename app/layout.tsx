import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "VISION HUB — SEED × TOPCON Healthcare", template: "%s · VISION HUB" },
  description:
    "Professional eye care & contact lens consultation in Puchong, Selangor. By appointment only. SEED × TOPCON Healthcare VISION HUB — Experience & Training Center.",
  metadataBase: new URL("https://visionhub.com.my"),
  openGraph: {
    type: "website",
    title: "VISION HUB — SEED × TOPCON Healthcare",
    description: "Personalized optometry services by appointment. Eye screening, contact lens fitting, keratoconus care.",
    siteName: "VISION HUB",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
