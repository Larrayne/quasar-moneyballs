<template>
  <router-view />
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import { applyUserPreferences, getUserSettings } from 'src/composables/useUserPreferences';
import { auth, onAuthStateChanged } from 'src/firebase/firebase';

defineOptions({
  name: 'App'
});

applyUserPreferences();

const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  try {
    const settings = await getUserSettings(currentUser?.uid);
    applyUserPreferences(settings);
  } catch (error) {
    console.error('Error loading user preferences', error);
    applyUserPreferences();
  }
});

onBeforeUnmount(() => {
  unsubscribe();
});
</script>
