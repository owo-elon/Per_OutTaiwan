/**
 * 專案路由配置
 * 注意：目前專案採用 Vite 多頁面配置 (Multi-Page Application)，
 * 此檔案主要用於定義功能模組路徑與未來 SPA 轉型參考。
 */

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: 'index.html',
    category: 'all'
  },
  {
    path: '/TakeList',
    name: 'PackingList',
    component: '/src/view/TakeList/TakeList.html',
    category: 'tool'
  },
  {
    path: '/Turntable',
    name: 'Turntable',
    component: '/src/view/Turntable/Turntable.html',
    category: 'game'
  }
];

export default routes;
