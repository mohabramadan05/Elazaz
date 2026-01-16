import type { Metadata } from "next";
import "./globals.css";
import { Cairo } from 'next/font/google';
import Header from "@/components/shared/header";
import Footer from "@/components/shared/Footer";


const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "EL Azaz",
  description: "EL Azaz",
};

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} antialiased`}
      >
        <Header />
        {children}
        <Footer/>
      </body>
    </html>
  );
}
