import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { GAMES } from "@/lib/games";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const gamePages = GAMES.map((g) => ({
    url: `${site.url}/top-up/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...gamePages,
  ];
}
