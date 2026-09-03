export const routes = [
  {
    path: '/',
    name: 'Home',
    component: '/index.html',
    category: 'all'
  },
  {
    path: '/src/view/takelist/takelist.html',
    name: 'PackingList',
    component: '/src/view/takelist/takelist.html',
    category: 'tool'
  },
  {
    path: '/src/view/turntable/turntable.html',
    name: 'Turntable',
    component: '/src/view/turntable/turntable.html',
    category: 'game'
  }
];

export default routes;
