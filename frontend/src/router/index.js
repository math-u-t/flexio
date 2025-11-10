import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Top',
    component: () => import('../views/TopPage.vue'),
    meta: { title: 'sphylics - 匿名チャット' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
    meta: { title: 'About - sphylics' }
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('../views/PolicyPage.vue'),
    meta: { title: 'Privacy Policy - sphylics' }
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('../views/FAQPage.vue'),
    meta: { title: 'FAQ - sphylics' }
  },
  {
    path: '/inquiry',
    name: 'Inquiry',
    component: () => import('../views/InquiryPage.vue'),
    meta: { title: 'お問い合わせ - sphylics' }
  },
  {
    path: '/chat/:chatId',
    name: 'Chat',
    component: () => import('../views/ChatPage.vue'),
    meta: { title: 'チャット - sphylics' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardPage.vue'),
    meta: { title: 'ダッシュボード - sphylics', requiresAuth: true }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/ErrorPage.vue'),
    meta: { title: 'エラー - sphylics' }
  },
  {
    path: '/newchat',
    name: 'NewChat',
    component: () => import('../views/NewChatPage.vue'),
    meta: { title: '新規チャット作成 - sphylics', requiresAuth: true }
  },
  {
    path: '/newaccount',
    name: 'NewAccount',
    component: () => import('../views/NewAccountPage.vue'),
    meta: { title: 'アカウント作成 - sphylics' }
  },
  {
    path: '/joinchat',
    name: 'JoinChat',
    component: () => import('../views/JoinChatPage.vue'),
    meta: { title: 'チャット参加 - sphylics', requiresAuth: true }
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('../views/JobsPage.vue'),
    meta: { title: '採用情報 - sphylics' }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../views/TermsPage.vue'),
    meta: { title: '利用規約 - sphylics' }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('../views/StatsPage.vue'),
    meta: { title: '統計情報 - sphylics' }
  },
  {
    path: '/devs',
    name: 'Devs',
    component: () => import('../views/DevsPage.vue'),
    meta: { title: 'API Docs - sphylics' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminPage.vue'),
    meta: { title: '管理者ページ - sphylics', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/information',
    name: 'Information',
    component: () => import('../views/InformationPage.vue'),
    meta: { title: 'お知らせ - sphylics' }
  },
  {
    path: '/newfunctionlab',
    name: 'NewFunctionLab',
    component: () => import('../views/NewFunctionLabPage.vue'),
    meta: { title: '新機能ラボ - sphylics' }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/SearchPage.vue'),
    meta: { title: '検索 - sphylics' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/error'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title || 'sphylics'

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('sphylics_user_id')
    if (!isAuthenticated) {
      next('/newaccount')
      return
    }
  }

  // Check if route requires admin
  if (to.meta.requiresAdmin) {
    const isAdmin = localStorage.getItem('sphylics_is_admin') === 'true'
    if (!isAdmin) {
      next('/error')
      return
    }
  }

  next()
})

export default router
