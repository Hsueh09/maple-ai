interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export function filterResults(
  results: SearchResult[],
  topics: string[],
  level: number | null
) {
  const gameKeywords = [
    "楓星",
    "MapleStar",
    "楓之谷MapleStar",
  ];

  return results
    .map((result) => {
      const text = `
        ${result.title}
        ${result.content}
      `.toLowerCase();

      let relevanceScore = result.score;

      // =========================
      // 1. 確認是否真的與楓星有關
      // =========================

      const hasGameKeyword = gameKeywords.some((keyword) =>
        text.includes(keyword.toLowerCase())
      );

      if (!hasGameKeyword) {
        return null;
      }

      relevanceScore += 1;

      // =========================
      // 2. 根據問題主題增加分數
      // =========================

      for (const topic of topics) {
        if (text.includes(topic.toLowerCase())) {
          relevanceScore += 0.5;
        }
      }

      // =========================
      // 3. 如果有等級，檢查結果是否提到相關等級
      // =========================

      if (level) {
        const levelPattern = new RegExp(
          `(?:${level}|${level - 1}|${level + 1})\\s*等`,
          "i"
        );

        if (levelPattern.test(text)) {
          relevanceScore += 0.5;
        }
      }

      return {
        ...result,
        relevanceScore,
      };
    })
    .filter((result) => result !== null)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);
}