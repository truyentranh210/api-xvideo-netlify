import fetch from "node-fetch";
import * as cheerio from "cheerio";

const JRANTS_BASE_URL = "https://vn.jrants.com";

export async function handler(event) {
  const keyword = event.queryStringParameters.keyword;
  if (!keyword) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Thiếu tham số 'keyword'" }),
    };
  }

  const search_url = `${JRANTS_BASE_URL}/?s=${encodeURIComponent(keyword)}`;

  try {
    const res = await fetch(search_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Referer": "https://www.google.com/",
      },
    });

    if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);
    const articles = [];

    $("article.post-item h2.post-title a").each((_, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr("href");
      articles.push({ title, link });
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articles),
    };
  } catch (err) {
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Lỗi khi truy cập Jrants: ${err}` }),
    };
  }
}
