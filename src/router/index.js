import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../views/layouts/MainLayout.vue'
import SaleView from '../views/SaleView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import TransactionIndex from '@/views/Transaction/TransactionIndex.vue'
import CustomerIndex from '@/views/Customer/CustomerIndex.vue'
import ProductIndex from '@/views/Product/ProductIndex.vue'
import { isAuthenticated } from "../utils/auth";
import TransactionDetail from '@/views/Transaction/TransactionDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      name: 'sale',
      children: [
        { path: '', component: SaleView },
        { path: 'transaksi', component: TransactionIndex },
        { path: '/transaksi/:id', component: TransactionDetail },
        { path: 'produk', component: ProductIndex },
        { path: 'customer', component: CustomerIndex },
      ],
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const loggedIn = isAuthenticated();

  if (to.meta.requiresAuth && !loggedIn) {
    next({ name: "login" });
  } else if (!to.meta.requiresAuth && loggedIn) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router
