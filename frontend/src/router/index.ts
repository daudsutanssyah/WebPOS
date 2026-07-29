import AppLayout from "@/layout/AppLayout.vue";
import Login from "@/pages/auth/Login.vue";
import CustomerForm from "@/pages/customers/CustomerForm.vue";
import CustomerList from "@/pages/customers/CustomerList.vue";
import Dashboard from "@/pages/Dashboard.vue";
import PosView from "@/pages/pos/PosView.vue";
import CategoryForm from "@/pages/product-categories/CategoryForm.vue";
import CategoryList from "@/pages/product-categories/CategoryList.vue";
import ProductForm from "@/pages/products/ProductForm.vue";
import ProductList from "@/pages/products/ProductList.vue";
import TransactionDetail from "@/pages/transactions/TransactionDetail.vue";
import TransactionList from "@/pages/transactions/TransactionList.vue";
import { useAuthStore } from "@/stores/auth.store";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { guest: true },
    },
    {
      path: "/",
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "dashboard",
          component: Dashboard,
        },
        {
          path: "/product-categories",
          name: "product-categories",
          component: CategoryList,
        },
        {
          path: "/product-categories/create",
          name: "product-categories-create",
          component: CategoryForm,
        },
        {
          path: "/product-categories/:id/edit",
          name: "product-categories-edit",
          component: CategoryForm,
        },
        {
          path: "/products",
          name: "products",
          component: ProductList,
        },
        {
          path: "/products/create",
          name: "products-create",
          component: ProductForm,
        },
        {
          path: "/products/:id/edit",
          name: "products-edit",
          component: ProductForm,
        },
        {
          path: "/customers",
          name: "customers",
          component: CustomerList,
        },
        {
          path: "/customers/create",
          name: "customers-create",
          component: CustomerForm,
        },
        {
          path: "/customers/:id/edit",
          name: "customers-edit",
          component: CustomerForm,
        },
        {
          path: "/transactions",
          name: "transactions",
          component: TransactionList,
        },
        {
          path: "/transactions/:id",
          name: "transactions-detail",
          component: TransactionDetail,
        },
        {
          path: "/pos",
          name: "pos",
          component: PosView,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from) => {
  const auth = useAuthStore();

  if (auth.isAuthenticated && !auth.user) {
    try {
      await auth.fetchUser();
    } catch (error) {
      auth.logout();
      return { name: "login" };
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: "login" };
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return { path: "/" };
  }

  return true;
});

export default router;
