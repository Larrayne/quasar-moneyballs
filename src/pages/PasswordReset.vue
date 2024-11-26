<template>

    <q-page class="q-pa-md">
        <div class = "text-h6 q-mb-md"> Reset Password</div>
        <q-input filled v-model= "email" label="email"/>
        <q-btn label="send reset Link" @click="goToLogin" class="q-mt-md" />
    </q-page>
</template>

<script setup>
    import {ref} from 'vue'
    import {useAuth} from 'src/composables/useAuth'
    import {useRouter} from 'vue-router'

    const {resetPassword} = useAuth();
    const router = useRouter();
    const email = ref('');

    const emailRule = (val) => /@gmail\.com$/.test(val) || 'Email must be a Gmail address';

    const passwordRule = (val) => 
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(val) || 
    'Password must be at least 6 characters long and contain at least one number and one special character';


    const goToLogin = () => {
    router.push('/login')
  }
  const handleReset = async () => {
    if (newPassword.value === confirmPassword.value) {
      if (newPassword.value === oldPassword) {
        alert("You cannot reset to the same password.");
        return;
      }
      try {
        await resetPassword(email.value, newPassword.value);
        router.push('/login');
      } catch (error) {
        console.error("Error resetting password:", error.message);
      }
    } else {
      alert("Passwords do not match.");
    }
  };
</script>