import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = [
  '/login', '/signup', '/success-signup', '/donation-fail', '/two-factor-auth',
  '/donation-success', '/donation-choose', '/email-verified',
  '/terms-and-conditions', '/privacy-and-policy', '/reset-password/_', '/story-book'
] // 不重定向白名单

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1 || to.path.includes('/reset-password')) {
      next()
    } else {
      next(`/login?redirect=${to.path}&userId=${store.state.user.userId}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})