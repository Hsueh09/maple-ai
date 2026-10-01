console.log("🔥🔥🔥 我正在使用新的 route.ts 🔥🔥🔥");

import OpenAI from "openai";
import * as cheerio from "cheerio";
import { analyzeQuestion } from "./analyzeQuestion";
import { searchWeb } from "./searchWeb";
import { filterResults } from "./filterResults";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const officialUrls = [
  "https://tw.maplestar.io/news/notices/4489af40-a411-4bef-b750-c9524297818c",
];

export async function POST(req: Request) {
  try {
    console.error("========== CHAT API TEST ==========");

    const { message } = await req.json();

    // =========================
    // 1. 分析使用者問題
    // =========================

    const analysis = analyzeQuestion(message);

    console.error("收到問題：", message);
    console.error("問題分析結果：", analysis);

    // =========================
    // 2. 網路搜尋
    // =========================

    const searchResults = [];

    for (const query of analysis.searchQueries) {
      const results = await searchWeb(query);

      searchResults.push({
        query,
        results,
      });
    }

    console.log("搜尋結果：", searchResults);

    // =========================
    // 3. 合併所有搜尋結果
    // =========================

    const allResults = searchResults.flatMap(
      (item) => item.results
    );

    // =========================
    // 4. 篩選相關搜尋結果
    // =========================

    const filteredResults = filterResults(
      allResults,
      analysis.topics,
      analysis.level
    );

    console.log("篩選後結果：", filteredResults);

    // =========================
    // 5. 整理成 GPT 可以閱讀的資料
    // =========================

    const sourcesText = filteredResults
      .map(
        (result, index) => `
【來源 ${index + 1}】

標題：
${result.title}

網址：
${result.url}

內容：
${result.content}
`
      )
      .join("\n");

    // =========================
    // 6. 判斷是否需要官方即時資料
    // =========================

    const needRealtimeData =
      message.includes("維修") ||
      message.includes("公告") ||
      message.includes("活動") ||
      message.includes("更新") ||
      message.includes("改版");

    let prompt = "";

    // =========================
    // 7. 官方公告類問題
    // =========================

    if (needRealtimeData) {
      const page = await fetch(officialUrls[0], {
        cache: "no-store",
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
      });

      const html = await page.text();

      const $ = cheerio.load(html);

      const title =
        $("h1").first().text().trim() ||
        $("title").text().trim() ||
        "楓星官方公告";

      const text = $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

      const timeIndex = text.indexOf("08:00");

      const officialNotice =
        timeIndex !== -1
          ? text.slice(
              Math.max(0, timeIndex - 300),
              timeIndex + 500
            )
          : text;

      const officialSourcesText = `
資料 1

來源：楓星官方公告

日期：2026-05-14

網址：
${officialUrls[0]}

標題：
${title}

內容：
${officialNotice}
`;

      prompt = `
你是楓之谷楓星伺服器的 AI 助手。

請根據以下官方資料回答玩家問題。

回答規則：
- 只能根據官方資料回答。
- 不可以自行猜測。
- 如果資料沒有提到，請說「目前資料來源沒有找到相關資訊」。
- 使用繁體中文。
- 回答簡短、實用。
- 回答最後附上資料來源網址。

官方資料：

${officialSourcesText}

玩家問題：

${message}
`;
    }

    // =========================
    // 8. 一般問題
    // =========================

    else {
      prompt = `
你是楓之谷楓星 MapleStar 伺服器的 AI 助手。

玩家問題：
${message}

以下是系統透過網路搜尋取得的資料：

${sourcesText}

請根據上述搜尋資料回答玩家問題。

回答規則：

1. 使用繁體中文回答。

2. 回答簡短、實用。

3. 優先使用上方搜尋資料，不要自行編造資料。

4. 如果搜尋資料不足以回答，請明確說：
「目前搜尋資料不足，無法確認。」

5. 如果搜尋資料彼此矛盾，請指出不同來源的資訊差異。

6. 不要把搜尋結果整段複製。

7. 請整理搜尋資料後再回答。

8. 不要使用與楓星 MapleStar 無關的資料。

9. 如果搜尋結果沒有提供玩家問題需要的資訊，不要自行補充未確認的遊戲資料。


玩家問題：
${message}
`;
    }

    // =========================
    // 9. 呼叫 OpenAI
    // =========================

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    // =========================
    // 10. 回傳結果
    // =========================

return Response.json({
  reply: response.output_text,
  debug: analysis,

  sources: filteredResults.map((result) => ({
    title: result.title,
    url: result.url,
  })),
});

  } catch (error) {
    console.error("Chat API 發生錯誤：", error);

    return Response.json(
      {
        reply: "後端發生錯誤，請檢查終端機錯誤訊息。",
      },
      { status: 500 }
    );
  }
}