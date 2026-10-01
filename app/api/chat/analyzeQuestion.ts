export function analyzeQuestion(message: string) {
  // 找等級
  const levelMatch = message.match(
    /(?:Lv\.?|LV\.?|等級|級)?\s*(\d+)\s*等?/i
  );

  const level = levelMatch ? Number(levelMatch[1]) : null;

  const topics: string[] = [];

  // 裝備
  if (
    message.includes("裝備") ||
    message.includes("武器") ||
    message.includes("防具") ||
    message.includes("飾品")
  ) {
    topics.push("裝備");
  }

  // 練等
  if (
    message.includes("練等") ||
    message.includes("練功") ||
    message.includes("練級") ||
    message.includes("去哪") ||
    message.includes("哪裡練") ||
    message.includes("地圖")
  ) {
    topics.push("練等");
  }

  // 技能
  if (
    message.includes("技能") ||
    message.includes("配點") ||
    message.includes("技能點")
  ) {
    topics.push("技能");
  }

  // 掉落
  if (
    message.includes("掉落") ||
    message.includes("掉什麼") ||
    message.includes("打什麼")
  ) {
    topics.push("掉落");
  }

  // 任務
  if (
    message.includes("任務") ||
    message.includes("任務怎麼解")
  ) {
    topics.push("任務");
  }

  // =========================
  // 產生搜尋關鍵字
  // =========================

  const searchQueries: string[] = [];

  if (level) {
    for (const topic of topics) {
      searchQueries.push(`楓星 ${level}等 ${topic}`);
    }
  }

  return {
    level,
    topics,
    searchQueries,
  };
}