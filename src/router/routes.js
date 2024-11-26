import { useAuth } from 'src/composables/useAuth';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') }, // Dashboard as default
      {
        path: '/ai-chat',
        component: () => import('pages/AiChatPage.vue'), // Adjust path if necessary
        name: 'AIChatPage'
      },
      { path: 'login', component: () => import('pages/Login.vue') },
      {
        path: '/entries',
        component: () => import('pages/PageEntries.vue'),
        beforeEnter: (to, from, next) => {
          if (!useAuth().isAuthenticated()) {
            next('/login');
          } else {
            next();
          }
        }
      },
      {
        path: '/settings',
        component: () => import('pages/PageSettings.vue'),
        beforeEnter: (to, from, next) => {
          if (!useAuth().isAuthenticated()) {
            next('/login');
          } else {
            next();
          }
        }
      },
      { path: 'register', component: () => import('pages/ResgistrationPage.vue') },
      { path: 'passwordreset', component: () => import('pages/PasswordReset.vue') },
      { path: 'registrationsuccess', component: () => import('pages/RegistrationSuccess.vue') },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
