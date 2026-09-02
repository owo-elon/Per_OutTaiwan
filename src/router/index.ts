export const routes = [
  {
    path: '/',
    name: 'Home',
    component: '/src/view/home/home.html',
    category: 'all'
  },
  {
    path: '/takelist',
    name: 'PackingList',
    component: '/src/view/takelist/takelist.html',
    category: 'tool'
  },
  {
    path: '/turntable',
    name: 'Turntable',
    component: '/src/view/turntable/turntable.html',
    category: 'game'
  }
];

export default routes;
