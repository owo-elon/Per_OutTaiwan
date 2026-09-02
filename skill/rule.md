# 🛠 Development Stack & Rules

## 🔧 Tech Stack
- Framework: Vue 3 (Composition API)
- Language: TypeScript
- Build Tool: Vite
- UI Library: PrimeVue
- CSS Framework: Tailwind CSS
- 3D / Animation: Three.js

---

## 📁 Project Structure Rules

### Page-level files
Each page MUST follow this structure:
- Static Data: `/public/{pageName}/{pageName}.json`
- Styles: `/css/{pageName}/{pageName}.css`
- View (HTML): `/view/{pageName}/{pageName}.html` (HTML should import TS template for rendering)
- Script (Logic): `/scripts/{pageName}/{pageName}.ts`

### Global Resources
- Global Scripts: `/scripts/_global/{name}.ts`
- Global Static Data: `/public/_global/{name}.json`

---

## 🧭 Routing Rules
- All routing MUST be configured in: `/router/index.ts`

---

## 🎨 Styling Rules

1. **General Standards:**
   - ALL styles MUST be defined as CSS classes, imported via CSS files.
   - MUST support Responsive Web Design (RWD) and utilize Tailwind CSS.

2. **Scrollbar & Overflow Control (Strict):**
   - **No Horizontal Scroll:** 頁面均不可出現水平卷軸。
   - **Invisible Vertical Scroll:** 頁面可上下滑動項目部分，不可出現垂直卷軸，但必須保有滑動功能。
   - **Implementation Rule:** 在 CSS 中實作 `.no-scrollbar`：
     ```css
     .no-scrollbar {
         -ms-overflow-style: none; /* IE/Edge */
         scrollbar-width: none;    /* Firefox */
     }
     .no-scrollbar::-webkit-scrollbar {
         display: none;            /* Chrome/Safari */
     }
     ```

---

## 💾 Data Persistence Rules (Local Storage First)

1. **Storage Priority:**
   - 所有從 JSON 載入或使用者生成的 Data，必須優先存儲於 `localStorage`。
2. **Initialization Logic:**
   - 頁面載入時，程序必須先檢查 `localStorage` 是否已有對應資料。
   - 若有，則從 `localStorage` 讀取；若無，則從 `/public/` 下的 JSON 檔案抓取並立即寫入 `localStorage`。
3. **Synchronization:**
   - 任何資料變更（State Update）必須同步更新回 `localStorage`，確保重新整理頁面後狀態不丟失。

---

## 🧩 Component Rules (Priority Order)

1. If standard UI is sufficient:
   - → MUST use **PrimeVue** components.
2. If requiring Animation, 3D visuals, or Advanced interaction:
   - → MUST use **Three.js** (HIGHER PRIORITY than PrimeVue).

---

## ⚙️ Architecture Principles

- **Modular Separation:** HTML / CSS / TS / JSON 必須完全分離。
- **State Management:** 建議使用簡單的 Reactive Store 並結合 `localStorage` 持久化。
- **Reusability:** 保持組件的解耦與可複用性。

---

## 🚨 Strict Rules

- **DO NOT:**
  - Inline CSS or inline JS logic inside HTML.
  - Mix global and page resources.
- **MUST:**
  - Follow naming consistency (Folder name = File name).
  - Ensure all data operations go through a `localStorage` sync layer.

---

## 🎯 Goal

- Maintain high scalability.
- Ensure clear separation of concerns.
- Optimize for AI-generated code consistency.