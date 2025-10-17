import fetch from "node-fetch";
import * as cheerio from "cheerio";

const BASE_URL = "https://www.xvideos.com";

export async function handler(event) {
  const keyword = event.queryStringParameters.keyword;
  const page = event.queryStringParameters.page || 0;

  if (!keyword) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Thiếu tham số 'keyword'" }),
    };
  }

  const keyword_for_url = keyword.replace(/\s+/g, "+");
  const search_url = `${BASE_URL}/?k=${keyword_for_url}&p=${page}`;

  try {
    const res = await fetch(search_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) throw new Error(`Lỗi HTTP ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);
    const videos = [];

    $("div.thumb-block").each((_, el) => {
      const linkTag = $(el).find(".thumb a");
      const titleTag = $(el).find("p.title a");
      if (linkTag.length && titleTag.length) {
        const link = BASE_URL + linkTag.attr("href");
        const title = titleTag.text().trim();
        videos.push({ title, link });
      }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videos),
    };
  } catch (err) {
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: `Lỗi khi truy cập trang web: ${err}` }),
    };
  }
}
