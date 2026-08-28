<template>
  <q-layout view="hHh lpR lFf">
    <q-header class="app-header">
      <q-toolbar class="app-toolbar">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <div class="brand-mark">
            <q-icon name="auto_stories" />
            <span>My Journal</span>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="app-drawer"
      :width="250" 
      :breakpoint="767"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
        
          Navigation
        </q-item-label>

        <NavLink
          v-for="link in navLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import NavLink from 'components/Nav/NavLink.vue'
import { useRouter } from 'vue-router';
import {useAuth} from 'src/composables/useAuth';
import { user } from 'src/firebase/firebase';

defineOptions({
  name: 'MainLayout'
})

const { logout } = useAuth();
const router = useRouter();

const navLinks = computed(() => {
  if (user.value) {
    return [
      {
        title: 'Entries',
        icon: 'article',
        link: '/entries'
      },
      {
        title: 'Settings',
        icon: 'settings',
        link: '/settings'
      },
      {
        title: 'Logout',
        icon: 'logout',
        action: () => logout(router)
      }
    ];
  }

  return [
    {
      title: 'Login',
      icon: 'login',
      link: '/login'
    },
    {
      title: 'Register',
      icon: 'person_add',
      link: '/register'
    }
  ];
});

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>

<style scoped>
.app-header {
  background: rgba(255, 248, 251, 0.82);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(117, 78, 57, 0.08);
}

.app-toolbar {
  min-height: 72px;
  color: #2e2019;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.app-drawer {
  background: linear-gradient(180deg, #fff7f2 0%, #ffe8de 100%);
  color: #2e2019;
}
</style>

