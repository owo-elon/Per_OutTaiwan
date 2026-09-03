# Architecture

## Overview

Per OutTaiwan 使用 Vite multi-page application（MPA）模式。每個頁面擁有獨立 entry，但共用同一套 Layout、設計 token、資料服務與 Three.js 背景。

```text
index.html
src/view/*/*.html
        |
        v
src/scripts/{home,takelist,turntable}
        |
        +--> src/composables
        +--> src/services
        +--> src/types
        +--> src/layout/layout.ts
        +--> src/three
        +--> src/css
```

## Layers

### Entry and view orchestration

`src/scripts/` 只負責：

- 建立 Vue application
- 組合 Layout、composables 與頁面 template
- 引入該頁需要的 CSS

舊 `_global` ThreeCarousel 與 Layout 路徑保留為 compatibility re-export，實作只有一份。

### State and behavior

`src/composables/` 管理頁面狀態與 UI 流程：

- `useDarkMode`：同步 `html.dark`、`body.dark`、localStorage 與 Three.js theme
- `useAnnouncements`：載入並選擇 global、country 或 turntable 公告
- `useDialogFocus`：初始焦點、Tab trap、Escape 與焦點還原
- `useHomeDashboard`：首頁 JSON、分類與載入狀態
- `useTakelistPage`：目的地／性別流程、分類、搜尋、進度與自訂項目
- `useWeather`：城市選擇、AbortController 與 Open-Meteo 資料
- `useTurntablePage` / `useTurntablePanel`：轉盤資料、結果與設定 HUD

### Services and contracts

`src/services/` 封裝外部邊界：

- `json.service.ts`：base-aware static JSON fetch 與 HTTP error
- `storage.service.ts`：localStorage read/write/JSON parsing
- `weather.service.ts`：Open-Meteo request

`src/types/` 描述所有 JSON、local state 與 Three.js bridge 契約。頁面不以 `any` 或 `@ts-ignore` 繞過型別。

### Three.js

`src/three/background/initThreeBackground.ts` 是共用背景 runtime。它只對外提供 typed command bridge：

```ts
interface ThreeBackgroundController {
  updateTheme(isDark: boolean): void;
  setSpeed(multiplier: number, duration?: number): void;
  celebrate(): void;
  destroy(): void;
}
```

所有 requestAnimationFrame、event listener、timer、geometry、material、texture 與 renderer 都在 `destroy()` 集中釋放。背景會限制 pixel ratio、依 viewport 降低星點數，並遵守 `prefers-reduced-motion`。

首頁 3D carousel 位於 `src/three/carousel/`。Canvas 不是唯一操作入口；相同功能同時提供語意化 HTML 快速連結與按鈕。

轉盤繪製與物理運算封裝在 `src/turntable/TurntableEngine.ts`，Vue composable 只處理資料和 UI state。

## Styling and responsive behavior

- `src/css/_global/design-tokens.css`：顏色、間距、陰影、圓角與 motion tokens
- `src/css/_global/vue-transition.css`：dialog、toast、category transitions 與 reduced-motion fallback
- `src/css/_global/layout.css`：Three.js background、topbar 與 safe-area-aware dock
- `src/css/{home,takelist,turntable}/`：頁面樣式

桌面版轉盤設定是 workspace 內的 floating HUD；820px 以下會變成 bottom sheet。打包清單使用可水平捲動的分類 filter 與正常文件滾動，不鎖定 body scroll。

## Data compatibility

MPA URL、public JSON 格式、Home `BASE_URL + link` 行為、Turntable `{ text, color, level }` 格式，以及既有打包清單 storage keys 均維持相容。韓國、日本、性別項目、日本限定項目、自訂項目、刪除、搜尋、天氣與進度保存仍由原資料契約驅動。

## Validation order

避免 `dist` 清除與並行工具競態，驗證順序固定為：

```bash
npm run lint
npm run build
npm run preview
```
