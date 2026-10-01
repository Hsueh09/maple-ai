export async function searchWeb(query: string) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 3,
      include_answer: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Tavily 搜尋失敗：${response.status}`);
  }

  const data = await response.json();

  return data.results;
}