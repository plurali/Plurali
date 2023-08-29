import { RouteLocationNormalized, RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { flash, FlashType, nextRedirect, user } from './store';
import { getUser } from './api/user';
import { StatusMap, formatError } from './api';

const routes: RouteRecordRaw[] = [
  {
    name: 'index_',
    path: '/',
    component: () => import('./layouts/default.vue' as string),
    children: [
      {
        name: 'index',
        path: '/',
        component: () => import('./pages/index.vue' as string),
      },
      {
        name: 'swagger',
        path: '/swagger',
        component: () => import('./pages/swagger.vue' as string),
      },
      {
        name: 'auth:login',
        path: '/auth/login',
        component: () => import('./pages/auth/login.vue' as string),
      },
      {
        name: 'auth:register',
        path: '/auth/register',
        component: () => import('./pages/auth/register.vue' as string),
      },
      {
        name: 'dashboard:index',
        path: '/dashboard',
        component: () => import('./pages/dashboard/index.vue' as string),
      },
      {
        name: 'dashboard:user',
        path: '/dashboard/user',
        component: () => import('./pages/dashboard/user.vue' as string),
      },
      {
        name: 'dashboard:system',
        path: '/dashboard/system',
        component: () => import('./pages/dashboard/system.vue' as string),
      },
      {
        name: 'dashboard:system:page:create',
        path: '/dashboard/system/page-create',
        component: () => import('./pages/dashboard/page-create.vue' as string),
      },
      {
        name: 'dashboard:system:page:edit',
        path: '/dashboard/system/page-edit/:pageId',
        component: () => import('./pages/dashboard/page-edit.vue' as string),
      },
      {
        name: 'dashboard:member',
        path: '/dashboard/member/:id',
        component: () => import('./pages/dashboard/member.vue' as string),
      },
      {
        name: 'dashboard:member:page:create',
        path: '/dashboard/member/:id/page-create',
        component: () => import('./pages/dashboard/page-create.vue' as string),
      },
      {
        name: 'dashboard:member:page:edit',
        path: '/dashboard/member/:id/page-edit/:pageId',
        component: () => import('./pages/dashboard/page-edit.vue' as string),
      },
      {
        name: 'public:system',
        path: '/:systemId/',
        component: () => import('./pages/system.vue' as string),
      },
      {
        name: 'public:member',
        path: '/:systemId/m/:memberId',
        component: () => import('./pages/member.vue' as string),
      },
      {
        name: 'public:system:page',
        path: '/:systemId/p/:pageId',
        component: () => import('./pages/page.vue' as string),
      },
      {
        name: 'public:member:page',
        path: '/:systemId/m/:memberId/p/:pageId',
        component: () => import('./pages/page.vue' as string),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const isAuth = (route: string | RouteLocationNormalized) =>
  (typeof route === 'string' ? route : route.path).startsWith('/auth');

export const isDashboard = (route: string | { path: string }) =>
  (typeof route === 'string' ? route : route.path).startsWith('/dashboard');

export const isFront = (route: string | RouteLocationNormalized) => !isAuth(route) && !isDashboard(route);

router.beforeEach(async to => {
  nextRedirect();

  const promise = (async () => {
    try {
      const data = (await getUser()).data;
      if (!data.success) throw new Error();

      user.value = data.data.user;
      if (isAuth(to)) return '/dashboard';

      if (isDashboard(to)) {
        if (!user.value.email) {
          flash('There is no email assigned to your account yet. Add one to prevent losing your account.', FlashType.Warning, false, true);
        } else if (!user.value.verified) {
          flash('Your email address is not verified. Please check your mailbox.', FlashType.Warning, false, true);  
        }

        if (!user.value.pluralKey) {
          flash('You must setup your Simply Plural API key!', FlashType.Danger, false, true);
          if (to.path !== '/dashboard/user') {
            return '/dashboard/user';
          }
        }
      }

    } catch (error) {
      user.value = null;
      const status = formatError(error);
      if (status !== StatusMap.NotAuthenticated) {
        flash(status, FlashType.Danger, true);
      } else if (isDashboard(to)) {
        flash('You need to be logged in to access the dashboard!', FlashType.Warning, true, false);
      }
      if (!isAuth(to)) {
        return '/auth/login';
      }
    }
  })();

  if (isFront(to)) {
    return;
  }

  return await promise;
});

export { router };
