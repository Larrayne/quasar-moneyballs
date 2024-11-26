<template>
  <q-layout view="hHh lpR lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
         
        <div class= "absolute-center">
        <q-icon name="auto_stories" />
          My Journal
        </div>
        </q-toolbar-title> 
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-primary "
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


import { ref,computed } from 'vue'
import NavLink from 'components/Nav/NavLink.vue'
import { useRouter } from 'vue-router';
import {useAuth} from 'src/composables/useAuth';

defineOptions({
  name: 'MainLayout'
})

const { logout } = useAuth();
const router = useRouter();

const navLinks = [
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
 
  
]


const route = useRouter()

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const shouldShowDrawer = computed(() => {
  return route.name === 'Entries' || route.name === 'Settings';
});

</script>

