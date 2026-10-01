/*import * as cheerio from "cheerio";

export type SourceDoc = {
  title: string;
  content: string;
  url: string;
  source: string;
  updatedAt: string;
};

export async function scrapeMapleStarNotice(url: string): Promise<SourceDoc> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "楓星公告";

  const text = $("body").text().replace(/\s+/g, " ").trim();

  console.log("=== SCRAPER DEBUG ===");
  console.log("URL:", url);
  console.log("TITLE:", title);
  console.log("HAS 08:", text.includes("08:00"));
  console.log("TEXT:", text.slice(0, 1000));

  const dateMatch = title.match(/(\d{1,2})月(\d{1,2})日/);

  let updatedAt = "2026-01-01";

  if (dateMatch) {
    const month = dateMatch[1].padStart(2, "0");
    const day = dateMatch[2].padStart(2, "0");
    updatedAt = `2026-${month}-${day}`;
  }

  return {
    title,
    content: text.slice(0, 3000),
    url,
    source: "楓星官方公告",
    updatedAt,
  };
}*/