import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('../views/Home.vue'),
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('../views/Index.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('../views/Search.vue'),
        meta:{
          keepAlive: false
        }
      },
      {
        path: 'item',
        name: 'item',
        component: () => import('../views/Item.vue'),
      }
    ]
  },
  {
    name: 'ForgotPassword',
    path: '/forgotPassword',
    component: () => import('../components/ForgotPasswordPage.vue'),
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('../components/LoginPage.vue'),
  },
  {
    name: 'checkout',
    path: '/checkout',
    component: () => import('../views/Checkout.vue'),
  },
  {
    name: 'user',
    path: '/user',
    component: () => import('../views/User/userIndex.vue'),
    children: [
      {
        path: '/user/edit',
        // path: 'edit',
        component: () => import('../views/User/profile.vue'),
      },
      {
        path: '/user/phones',
        component: () => import('../views/User/phoneList.vue'),
      },
      {
        path: '/user/comments',
        component: () => import('../views/User/comments.vue'),
      }
    ]
},
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   if(to.name === 'login'){

//   }
// })


export default router;