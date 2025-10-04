import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AlertProvider } from "@/contexts/AlertContext";
import { AlertWrapper } from "@/components/Alerts/AlertWrapper";
import { EmergencyNotificationManager } from "@/components/Emergency/EmergencyNotificationManager/EmergencyNotificationManager";
import { MobileOptimizedLayout } from "@/components/Mobile/MobileOptimizedLayout/MobileOptimizedLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Air Aura",
  description: "App for monitoring air quality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <MobileOptimizedLayout>
          <AlertProvider>
            {children}
            <AlertWrapper />
            <EmergencyNotificationManager />
          </AlertProvider>
        </MobileOptimizedLayout>
        <Analytics />
      </body>
    </html>
  );
}
