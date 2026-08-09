import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "PIXOGAMEONLINE — Top Up Game Cepat & Aman",
    template: "%s — PIXOGAMEONLINE",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: "PIXOGAMEONLINE — Top Up Game Cepat & Aman",
    description: site.shortDescription,
    url: site.url,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: "PIXOGAMEONLINE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PIXOGAMEONLINE — Top Up Game Cepat & Aman",
    description: site.shortDescription,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#org`,
        name: site.name,
        url: site.url,
        description: site.description,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        url: site.url,
        name: site.name,
        inLanguage: "id-ID",
        publisher: { "@id": `${site.url}/#org` },
      },
    ],
  };

  return (
    <html lang="id" className="antialiased">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
