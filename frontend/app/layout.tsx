import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "./components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', 
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', 
});

export const metadata: Metadata = {
  title: {
    absolute: "Техенопарк 'Kванториум' МАУ ДО 'СЮТ'",
    template: "%s | Kванториум Новоуральск",
  },
  description: "Технопарк 'Kванториум'",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Theme appearance="light" hasBackground={false} suppressHydrationWarning>
          <QueryProvider>
            <AuthProvider>
              <WebSocketProvider>
                <Toaster position="bottom-right" />
                {children}
              </WebSocketProvider>
            </AuthProvider>
          </QueryProvider>
        </Theme>
      </body>
    </html>
  );
}
