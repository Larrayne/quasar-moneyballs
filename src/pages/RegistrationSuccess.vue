<template>
    <q-page class="q-pa-md text-center">
      <div class="text-h5 q-mb-md">Registration Successful!</div>
      <div>Thank you for registering. Please check your email to verify your account.</div>
      <q-btn label="Go to Login" @click="goToLogin" class="q-mt-md" color="primary" />
    </q-page>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToLogin = () => {
    router.push('/login');
  };
  </script>


<style scoped>
    
</style>