import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "CRM Dentar - Denthub.al",
  description: "Menaxhimi i avancuar i klinikave dentare.",
};

import WhatsAppFloating from "@/components/WhatsAppFloating";
import TenantProvider from "@/components/TenantProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <TenantProvider />
        <Layout>
          {children}
        </Layout>
        <WhatsAppFloating />
      </body>
    </html>
  );
}
