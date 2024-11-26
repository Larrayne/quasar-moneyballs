import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useAuth } from 'src/composables/useAuth'; // Adjust path as needed

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER ? createMemoryHistory : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  

  // Route Guard
  Router.beforeEach((to, from, next) => {
    const { isAuthenticated } = useAuth(); // Check if user is authenticated
    if (to.meta.requiresAuth && !isAuthenticated()) {
      next('/login'); // Redirect unauthenticated users to login
    } else {
      next(); // Proceed if authenticated or no auth required
    }
  });

  return Router;
});



