import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Livit — Imóveis com Permuta",
  description:
    "Plataforma para corretores cadastrarem imóveis e gerenciarem permutas em tempo real. Web e mobile.",
};

export const viewport: Viewport = {
  themeColor: "#3c50e0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-dvh bg-background">
        <TopNav />
        <Sidebar />
        <main className="min-h-dvh px-4 pb-24 pt-0 md:pl-72 md:pr-6 md:pb-8 md:pt-[calc(57px+1.5rem)]">
          <div className="mx-auto w-full max-w-sm md:max-w-none">
            {children}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
