import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name + " — Top Up Game Simpel & Praktis Tanpa Registrasi",
    template: "%s — " + site.name,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.name + " — Top Up Game Simpel & Praktis Tanpa Registrasi",
    description: site.shortDescription,
    url: site.url,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name + " — Top Up Game Simpel & Praktis Tanpa Registrasi",
    description: site.shortDescription,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: "/favicon.svg",
  },
  applicationName: site.name,
  creator: site.name,
  keywords: [
    "top up game",
    "top up murah",
    "beli diamond",
    "top up mobile legends",
    "top up free fire",
    "top up pubg mobile",
    "top up cod mobile",
    "top up magic chess",
    "top up tanpa login",
  ],
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
        logo: `${site.url}/favicon.svg`,
        image: `${site.url}${site.ogImage}`,
        description: site.description,
        sameAs: [],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#site`,
        url: site.url,
        name: site.name,
        alternateName: "PIXOGAMEONLINE Top Up",
        description: site.description,
        inLanguage: "id-ID",
        publisher: { "@id": `${site.url}/#org` },
      },
      {
        "@type": "WebPage",
        "@id": `${site.url}/#webpage`,
        url: site.url,
        name: site.name + " — Top Up Game Simpel & Praktis Tanpa Registrasi",
        isPartOf: { "@id": `${site.url}/#site` },
        about: { "@id": `${site.url}/#org` },
        inLanguage: "id-ID",
        description: site.shortDescription,
      },
    ],
  };

  return (
    <html lang="id" className="antialiased">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content={site.themeColor} />
        <link rel="manifest" href="/site.webmanifest" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
