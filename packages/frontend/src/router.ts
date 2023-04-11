import { RouteLocationNormalized, RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { flash, flashes, FlashType, user } from './store'
import { getUser } from './api/user'
import { AxiosError } from 'axios'
import { formatError } from './api'

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

export const isAuth = (route: string | RouteLocationNormalized) =>
  (typeof route === 'string' ? route : route.path).startsWith('/auth')

export const isDashboard = (route: string | RouteLocationNormalized) =>
  (typeof route === 'string' ? route : route.path).startsWith('/dashboard')

export const isFront = (route: string | RouteLocationNormalized) => !isAuth(route) && !isDashboard(route)

router.beforeEach(async to => {
  flashes.value = []

  const promise = (async () => {
    try {
      const data = (await getUser()).data
      if (!data.success) throw new Error()

      user.value = data.data.user
      if (isAuth(to)) return '/dashboard'

      if (isDashboard(to) && !user.value.pluralKey) {
        flash('You must setup your Simply Plural API key!', FlashType.Danger)
        if (to.path !== '/dashboard/user') {
          return '/dashboard/user'
        }
      }
    } catch (error) {
      user.value = null
      if (!(error instanceof AxiosError) || (error.status ?? 400) !== 401) {
        flash(formatError(error), FlashType.Danger, true)
      }
      if (isDashboard(to)) return '/auth/login'
    }
  })()

  if (isFront(to)) {
    return
  }

  await promise
})

export { router }
