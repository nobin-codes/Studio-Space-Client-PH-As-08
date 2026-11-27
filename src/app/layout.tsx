
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteShell from "@/components/site-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";
import "./theme.css";
import "./motion.css";
import "./homepage.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace | Find Your Creative Space",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book creative studios, photography spaces, podcast rooms, music suites, and production workspaces with StudioSpace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
