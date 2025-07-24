import BackToTopButton from "@/components/common/back-button";
import { SchemaMarkup } from "@/components/common/schema-markup";
import { ThemeProvider } from "@/components/common/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Script from "next/script";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const viewport: Viewport = {
  themeColor: "#4361EE",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://soul-touch.vercel.app"),
  title: "Soul Touch - Staff Attendance System",
  description: "A comprehensive staff attendance system for Soul Touch Academy",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans antialiased ${dmSans.variable} ${plusJakarta.variable}`}
      >
        <NextTopLoader color={"#4361EE"} zIndex={9999} />
        <Toaster
          toastOptions={{
            className:
              "bg-white dark:bg-slate-800 dark:text-slate-200 z-[999999]",
            duration: 3000,
          }}
          position="top-right"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          storageKey="soul-touch-theme"
        >
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
          <BackToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
