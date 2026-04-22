import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oracle AI - Análise Institucional",
  description: "Mapeamento de liquidez e fluxo de ordens via Inteligência Artificial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Adicionamos o suppressHydrationWarning aqui para ignorar erros de extensões do Chrome
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // Isso garante que extensões que injetam atributos não quebrem o site
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}