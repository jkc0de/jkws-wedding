import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Pinyon_Script } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const script = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Wong Wai Seun & Jordan Koh — 23 January 2027",
    template: "%s · Wong Wai Seun & Jordan Koh",
  },
  description:
    "Join us to celebrate our wedding at The St. Regis Kuala Lumpur on 23 January 2027.",
  openGraph: {
    title: "Wong Wai Seun & Jordan Koh",
    description: "Saturday, 23 January 2027 · The St. Regis Kuala Lumpur",
    type: "website",
    locale: "en_MY",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Wong Wai Seun & Jordan Koh — 23 January 2027, The St. Regis Kuala Lumpur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wong Wai Seun & Jordan Koh",
    description: "Saturday, 23 January 2027 · The St. Regis Kuala Lumpur",
    images: ["/og"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${script.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
        <Footer />
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
