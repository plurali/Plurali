import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { flash, flashes, FlashType, user } from './store'
import { getUser } from './api/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('./layouts/default.vue' as string),
    children: [
      {
        path: '/',
        component: () => import('./pages/index.vue' as string),
      },
      {
        path: '/auth/login',
        component: () => import('./pages/auth/login.vue' as string),
      },
      {
        path: '/auth/register',
        component: () => import('./pages/auth/register.vue' as string),
      },
      {
        path: '/dashboard',
        component: () => import('./pages/dashboard/index.vue' as string),
      },
      {
        path: '/dashboard/user',
        component: () => import('./pages/dashboard/user.vue' as string),
      },
      {
        path: '/dashboard/system',
        component: () => import('./pages/dashboard/system.vue' as string),
      },
      {
        path: '/dashboard/member/:id',
        component: () => import('./pages/dashboard/member.vue' as string),
      },
      {
        path: '/:systemId',
        component: () => import('./pages/system.vue' as string),
      },
      {
        path: '/:systemId/:memberId',
        component: () => import('./pages/member.vue' as string),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async to => {
  flashes.value = []

  try {
    const data = (await getUser()).data
    if (!data.success) throw new Error()

    user.value = data.data.user
  } catch (error) {
    user.value = null
  }

  if (to.path.startsWith('/auth') && !!user.value) {
    return router.push('/dashboard')
  }

  if (to.path.startsWith('/dashboard')) {
    if (!user.value) {
      return router.push('/auth/login')
    }

    if (!user.value.pluralKey) {
      flash('You must setup your Simply Plural API key!', FlashType.Danger)
      if (to.path !== '/dashboard/user') {
        router.push('/dashboard/user')
      }
      return
    }
  }
})

export { router }
