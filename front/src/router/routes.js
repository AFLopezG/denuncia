
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'consulta', component: () => import('pages/Consulta.vue') },
      { path: 'reclamos', component: () => import('pages/Reclamos.vue') },
      { path: 'reclamos/:cedula', component: () => import('pages/Reclamos.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
