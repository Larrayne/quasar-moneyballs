<template>
  <q-page class="q-pa-md">
    <h5>Happy to have you here!</h5>
    <p>Welcome to your journal! Please login or register to continue.</p>

    <!-- Button to navigate to login page -->
    <q-btn 
      label="Login" 
      @click="$router.push('/login')" 
      class="q-mb-md" 
      color="primary" 
    />
    
    <!-- Button to navigate to registration page -->
    <q-btn 
      label="Register" 
      @click="$router.push('/register')" 
      class="q-mb-md" 
      color="secondary" 
    />
  </q-page>
</template>

<script setup>
  import { onAuthStateChanged } from "firebase/auth";

  function checkAuth(){
    onAuthStateChanged(auth, (user) => {
      if(user){
        console.log("user is authenticated")
      }else{
        console.log("user is not authenticated")
      }
    })
  }


</script>

<style scoped>
</style>
