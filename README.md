# MapleStar AI 🎮🤖

一個針對 **楓之谷 MapleStar 伺服器**設計的 AI 遊戲助手。

使用者可以輸入遊戲相關問題，系統會先分析問題類型，再透過網路搜尋取得相關資料，經過篩選後交由 AI 整理成容易理解的回答，並提供參考來源。

> 本專案主要作為前端開發與 AI API 整合作品集，著重於 React / Next.js 前端介面、API 串接、資料處理與使用者體驗。

---

## 📌 專案介紹

一般 AI 聊天機器人可能直接依照模型既有知識回答遊戲問題，容易產生過時或不正確的資訊。

因此本專案採用「**搜尋 → 篩選 → AI 整理**」的方式：

```text
使用者輸入問題
        ↓
React / Next.js 前端
        ↓
Next.js API Route
        ↓
問題分析
        ↓
Tavily 網路搜尋
        ↓
搜尋結果篩選與排序
        ↓
OpenAI AI 整理
        ↓
回傳回答 + 參考來源
```

透過先取得外部資料，再讓 AI 根據搜尋結果回答，降低 AI 自行產生未經確認資訊的情況。

---

## ✨ 主要功能

### 💬 AI 聊天介面

* 提供遊戲問題輸入介面
* 顯示使用者與 AI 對話內容
* 支援 Loading 狀態
* 處理 API 錯誤
* 提供簡潔的聊天 UI

### 🔎 問題分析

系統會先分析使用者問題，例如：

* 等級
* 裝備
* 練等
* 技能
* 掉落
* 任務

再根據問題內容產生對應的搜尋關鍵字。

### 🌐 網路資料搜尋

使用 **Tavily API** 搜尋相關遊戲資料。

搜尋結果會經過基本的相關性判斷，例如：

* 是否與 MapleStar 有關
* 是否符合使用者詢問的主題
* 是否符合玩家等級

再將較相關的資料交給 AI。

### 🤖 AI 回答

使用 **OpenAI API** 根據搜尋結果整理答案。

系統會要求 AI：

* 優先使用搜尋資料
* 不自行編造遊戲資訊
* 搜尋資料不足時明確告知
* 遇到資料衝突時指出差異
* 使用繁體中文回答

### 🔗 參考來源

AI 回答下方會顯示實際使用的搜尋來源。

使用者可以直接點擊來源查看原始資料。

---

## 🛠️ 使用技術

| 技術          | 用途                  |
| ------------ | --------------------- |
| Next.js      | 前端框架與 API Route   |
| React        | 建立互動式 UI          |
| TypeScript   | 型別管理與程式開發      |
| Tailwind CSS | UI 樣式與 RWD          |
| OpenAI API   | AI 問答與內容整理       |
| Tavily API   | 網路搜尋與資料取得      |
| Cheerio      | 官方網頁資料解析        |
| Lucide React | UI Icon               |
| Git / GitHub | 版本控制與專案管理      |

---

## 🧩 專案架構

```text
maple-ai/
│
├─ app/
│  └─ api/
│     └─ chat/
│        ├─ route.ts
│        ├─ analyzeQuestion.ts
│        ├─ searchWeb.ts
│        └─ filterResults.ts
│
├─ components/
│  ├─ chat-interface.tsx
│  └─ ui/
│
├─ hooks/
├─ lib/
├─ public/
├─ styles/
│
├─ .gitignore
├─ next.config.ts
├─ package.json
├─ tsconfig.json
└─ README.md
```

### API 處理流程

主要 API 邏輯位於：

```text
app/api/chat/route.ts
```

負責整合整個 AI 問答流程：

```text
POST /api/chat
      ↓
analyzeQuestion()
      ↓
searchWeb()
      ↓
filterResults()
      ↓
OpenAI API
      ↓
回傳 JSON
```

---

## 🧠 核心設計

### 1. 問題分析

`analyzeQuestion.ts`

將使用者輸入轉換成結構化資訊：

```text
使用者問題
    ↓
分析等級
    ↓
判斷問題主題
    ↓
建立搜尋 Query
```

例如：

```text
「50等去哪裡練等？」

↓

level: 50

topics:
- 練等

searchQueries:
- 楓星 50等 練等
```

---

### 2. 搜尋資料取得

`searchWeb.ts`

透過 Tavily API 取得網路搜尋結果。

搜尋結果包含：

* 標題
* URL
* 內容
* 搜尋相關性分數

---

### 3. 搜尋結果篩選

`filterResults.ts`

對搜尋結果進行基本相關性判斷。

目前會依照：

```text
遊戲關鍵字
+
問題主題
+
玩家等級
+
原始搜尋分數
```

計算相關性後重新排序。

---

### 4. AI 資料整理

最後將篩選後的資料提供給 OpenAI：

```text
搜尋結果
    ↓
相關資料
    ↓
OpenAI
    ↓
整理成玩家容易理解的答案
```

並要求 AI 避免在搜尋資料不足時自行補充未確認資訊。

---

## 🎨 前端 UI

前端主要使用 React 建立聊天介面。

目前包含：

* Chat Input
* Chat Bubble
* Loading 狀態
* Error Handling
* 參考來源區塊
* 外部連結
* Responsive UI

前端與後端透過 API 進行資料交換：

```text
React UI
   ↓
fetch("/api/chat")
   ↓
Next.js API
   ↓
AI / Search
   ↓
JSON
   ↓
React UI 更新
```

---

## 🔐 環境變數

本專案需要以下環境變數：

```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

請將環境變數放在：

```text
.env.local
```

`.env.local` 已加入 `.gitignore`，不會提交至 GitHub。

> 請勿將 API Key 直接寫入程式碼或公開 Repository。

---

## 🚀 本機執行

### 1. Clone 專案

```bash
git clone https://github.com/Hsueh09/maple-ai.git
```

### 2. 進入專案

```bash
cd maple-ai
```

### 3. 安裝套件

```bash
npm install
```

### 4. 建立環境變數

建立：

```text
.env.local
```

加入：

```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

### 5. 啟動開發環境

```bash
npm run dev
```

開啟：

```text
http://localhost:3000
```

---

## 📈 未來規劃

目前專案已完成基本 AI 問答、網路搜尋、資料篩選與來源呈現。

後續預計持續改善：

* [ ] 更完整的問題分類
* [ ] 職業 / Boss / 地圖等問題分析
* [ ] 更精準的搜尋結果排序
* [ ] AI 搜尋結果相關性判斷
* [ ] 對話紀錄
* [ ] 使用者登入
* [ ] Mobile UI 優化
* [ ] 線上部署
* [ ] 效能與 API 請求最佳化

---

## 👨‍💻 Project Purpose

本專案主要用於練習與展示：

* React / Next.js 前端開發
* TypeScript
* REST API 串接
* 第三方 API 整合
* AI API 整合
* 網路資料取得與處理
* Component-based UI 開發
* Loading / Error Handling
* 使用者介面與互動設計
* Git / GitHub 版本控制
