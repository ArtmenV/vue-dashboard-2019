import Vue from 'vue'
import Router from 'vue-router'
import baseUrl from '../api/config'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true, statusActive: false},
  { path: '/two-factor-auth', component: () => import('@/views/two-factor-auth'), hidden: true, statusActive: false},
  { path: '/signup', component: () => import('@/views/signup/index'), hidden: true, statusActive: false},
  { path: '/success-signup', component: () => import('@/views/success-signup/index'), hidden: true, statusActive: false},
  { path: '/404', component: () => import('@/views/404'), hidden: true, statusActive: false},
  
  // redirect to from `/` to `/server-managment`
  { path: '/', hidden: true, redirect: '/servers', statusActive: false},
  
  { path: '/servers', hidden: true, redirect: '/servers/list', statusActive: false},
  { path: '/templates', hidden: true, redirect: '/templates/list', statusActive: false},
  { path: '/tickets', hidden: true, redirect: '/tickets/list', statusActive: false},
  { path: '/server-groups', hidden: true, redirect: '/server-groups/list', statusActive: false},
  { path: '/action-files', hidden: true, redirect: '/action-files/list', statusActive: false},
  { path: '/servers/validate', hidden: true, redirect: '/servers/validate/_', statusActive: false},
  { path: '/servers/validate/:key/', hidden: true, component: () => import('@/views/validate/index'), statusActive: false},
  { path: '/reset-password', hidden: true, redirect: 'reset-password/_', statusActive: false},
  { path: '/reset-password/:key/', hidden: true, component: () => import('@/views/password-reset/index'), statusActive: false},
  { path: '/donation-choose', hidden: true, component: () => import('@/views/donation-choose/index'), statusActive: false},
  { path: '/donation-success', hidden: true, component: () => import('@/views/donation-success/index'), statusActive: false},
  { path: '/donation-fail', hidden: true, component: () => import('@/views/donation-fail/index'), statusActive: false},
  // { path: '/donation-make', hidden: true, component: () => import('@/views/donation-make/index')},
  { path: '/email-verified', hidden: true, component: () => import('@/views/email-verified'), statusActive: false},
  { path: '/terms-and-conditions', hidden: true, component: () => import('@/views/terms-and-conditions.vue'), statusActive: false},
  { path: '/privacy-and-policy', hidden: true, component: () => import('@/views/privacy-and-policy.vue'), statusActive: false},
  // { path: '/plan-upgrade', component: () => import('@/views/plan-upgrade/'), hidden: true },

  {
    path: '/servers/:id',
    component: Layout,
    redirect: '/servers/:id',
    name: 'Servers',
    hidden: false,
    statusActive: false,
    children: [{
      path: '/servers/:id',
      meta: {
        title: 'Servers',
        icon: 'server'
      },
      component: () => import('@/views/server-managment/index')
    }]
  },

  {
    path: '/plan-upgrade',
    component: Layout,
    redirect: '/plan-upgrade',
    name: 'Plan upgrade',
    hidden: true,
    statusActive: false,
    children: [{
      path: '/plan-upgrade',
      meta: {
        title: 'Plan upgrade',
        icon: 'server'
      },
      component: () => import('@/views/plan-upgrade/')
    }]
  },

  {
    path: '/action-files/:id',
    component: Layout,
    redirect: '/action-files/:id',
    name: 'Action files',
    hidden: false,
    statusActive: false,
    children: [{
      path: '/action-files/:id',
      meta: {
        title: 'Threatlists',
        icon: 'documentation'
      },
      component: () => import('@/views/action-files/index')
    }]
  },

  {
    path: '/server-groups/:id',
    component: Layout,
    redirect: '/server-groups/list',
    name: 'Server group',
    hidden: false,
    statusActive: false,
    children: [{
      path: `/server-groups/:id`,
      meta: {
        title: 'MSP Server Groups',
        icon: 'server_groups_'
      },
      component: () => import('@/views/server-groups/index')
    }]
  },

  {
    path: '/company',
    component: Layout,
    redirect: '/company',
    name: 'MSP Level',
    hidden: false,
    statusActive: false,
    children: [{
      path: `/company`,
      meta: {
        title: 'MSP Level',
        icon: 'msp_level_'
      },
      component: () => import('@/views/company/index')
    }]
  },

  {
    path: '/templates/:id',
    component: Layout,
    redirect: '/templates/:id',
    name: 'MSP Templates',
    hidden: false,
    statusActive: false,
    children: [{
      path: `/templates/:id`,
      meta: {
        title: 'MSP Templates',
        icon: 'templates_'
      },
      component: () => import('@/views/templates/index')
    }]
  },

  // {
  //   path: '/company',
  //   component: Layout,
  //   redirect: '/company',
  //   name: 'Org level',
  //   hidden: false,
  //   children: [{
  //     path: '/company',
  //     meta: {
  //       title: 'Org level',
  //       icon: 'documentation'
  //     },
  //     component: () => import('@/views/company/index')
  //   }]
  // },

  {
    path: '/tickets/:id',
    component: Layout,
    redirect: '/tickets/:id',
    name: 'Tickets',
    hidden: false,
    statusActive: false,
    children: [{
      path: '/tickets/:id',
      meta: {
        title: 'Support',
        icon: 'form'
      },
      component: () => import('@/views/tickets/index')
    }]
  },

  {
    path: '/logout',
    component: Layout,
    redirect: '/logout',
    name: 'Logout',
    hidden: true,
    statusActive: false,
    children: [{
      path: '/logout',
      meta: {
        title: 'Logout'
      },
      component: () => import('@/views/logout.vue')
    }]
  },

  {
    path: '/freshdesk-auth',
    component: Layout,
    redirect: '/freshdesk-auth',
    name: '_Forums',
    hidden: true,
    statusActive: false,
    children: [{
      path: '/freshdesk-auth',
      meta: {
        title: '_Forums',
        icon: 'peoples'
      },
      component: () => import('@/views/freshdesk-auth.vue')
    }]
  },

  {
    path: '/account',
    component: Layout,
    redirect: '/account',
    name: 'My account',
    hidden: false,
    statusActive: false,
    children: [{
      path: '/account',
      meta: {
        title: 'Settings',
        icon: 'settings'
      },
      component: () => import('@/views/account/index')
    },]
  },

  {
    path: '/freshdesk--auth',
    component: Layout,
    redirect: '/freshdesk--auth',
    name: 'Forums',
    hidden: false,
    statusActive: false,
    children: [{
      path: `https://${window.location.host}/freshdesk-auth`,
      meta: {
        title: 'Forums',
        icon: 'peoples'
      },
      component: () => import('@/views/freshdesk-auth.vue')
    }]
  },

  { 
    path: '/story-book', 
    component: () => import('@/views/ui-story/index'),
    hidden: true, 
    statusActive: false
  },
  { 
    path: '/generate-pdf', 
    component: () => import('@/views/generatePDF/index.vue'),
    hidden: true, 
    statusActive: false
  },
  
  { 
    path: '*', 
    redirect: '/404', 
    hidden: true, 
    statusActive: false, 
  }
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
