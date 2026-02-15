import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Slovenija prihodnosti | Volitve 2026",
  description:
    "Državljanska platforma za primerjavo strank in programov na državnozborskih volitvah v Sloveniji 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sl">
      <body className={`${playfair.variable} ${dmSans.variable} antialiased flex min-h-screen flex-col`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BN4G9MDHEB"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BN4G9MDHEB');
          `}
        </Script>
        <Header />
        <main className="flex-1">{children}</main>
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-6">
          <div className="mx-auto max-w-7xl text-sm text-slate-600">
            <h2 className="mb-2 font-semibold text-slate-800">Omejitev odgovornosti</h2>
            <p className="leading-relaxed">
              Povzetki na tej strani temeljijo na javno dostopnih programih, statutih in drugih
              uradnih virih političnih strank. Vsebina je pripravljena z avtomatizirano obdelavo,
              zato so možne poenostavitve ali nenamerne netočnosti. Stran ni uradni predstavnik
              nobene stranke in ne izraža njihovih stališč; namen je zgolj informiranje, ne
              politično nagovarjanje. Za popolno in zavezujočo razlago vedno preverite izvirne
              dokumente. Informativni značaj vsebine je v skladu z načelom obveščanja javnosti
              (npr. 4. člen ZMed); uporabniki nosijo odgovornost za lastno preverjanje podatkov.
            </p>
          </div>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
