import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consiglio Cittadino - La Democrazia Digitale per l'Italia",
  description: "Trasforma le tue idee in petizioni, le petizioni in movimenti, i movimenti in cambiamento reale. La piattaforma di democrazia digitale che l'Italia aspetta.",
  keywords: "democrazia digitale, petizioni, partecipazione civica, Italia, cittadini, politica",
  openGraph: {
    title: "Consiglio Cittadino - La Democrazia Digitale per l'Italia",
    description: "Trasforma le tue idee in petizioni, le petizioni in movimenti, i movimenti in cambiamento reale.",
    type: "website",
    locale: "it_IT"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
