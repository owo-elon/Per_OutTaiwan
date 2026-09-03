# Per OutTaiwan

Per OutTaiwan 是以 Vue 3、Vite、Tailwind CSS 4 與 Three.js 建立的多頁工具集合。首頁作為統一控制台，目前包含可保存進度的旅行打包清單與可自訂獎項的命運轉盤，並可持續加入不同類型的實用工具。

## 開發

需求：Node.js 20 或更新版本。

```bash
npm ci
npm run dev
```

常用指令：

| 指令 | 用途 |
|---|---|
| `npm run dev` | 在 `http://localhost:3000` 啟動開發伺服器 |
| `npm run lint` | 執行 TypeScript 型別檢查 |
| `npm run build` | 建立 production MPA bundle |
| `npm run preview` | 預覽 production build |
| `npm run clean` | 跨平台移除 `dist` |

## 頁面

| 功能 | URL |
|---|---|
| 首頁 | `/` |
| 打包清單 | `/src/view/takelist/takelist.html` |
| 命運轉盤 | `/src/view/turntable/turntable.html` |

URL 與檔案路徑均維持小寫，GitHub Pages build 會依 `GITHUB_REPOSITORY` 自動設定 base path。

## 資料與瀏覽器儲存

靜態資料契約位於：

- `public/home/home.json`
- `public/takelist/takelist.json`
- `public/turntable/turntable.json`
- `public/announcements.json`

打包清單保留以下 localStorage keys：

- `travel_packing_${country}_${gender}`
- `travel_packing_custom_${country}_${gender}`
- `travel_packing_deleted_${country}_${gender}`
- `weatherCity`
- `darkMode`

「清除勾選」只會清除目前目的地與旅客類型的勾選進度，不會刪除自訂物品或恢復已隱藏的預設物品。

## 維護

架構、生命週期、Three.js 邊界與資料流說明請參考 [`ARCHITECTURE.md`](./ARCHITECTURE.md)。
