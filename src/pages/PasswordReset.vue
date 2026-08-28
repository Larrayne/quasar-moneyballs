<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="reset-card q-pa-lg">
      <q-card-section class="text-center">
        <div class="text-h5 text-primary">Reset Password</div>
        <div class="text-caption text-grey-7">We will send a password reset link to your email.</div>
      </q-card-section>

      <q-form class="q-gutter-md" @submit.prevent="handleReset">
        <q-input
          v-model="email"
          filled
          type="email"
          label="Email"
          :rules="[emailRule]"
        />

        <q-btn label="Send Reset Link" type="submit" color="primary" class="full-width" />
        <q-btn flat label="Back to Login" color="primary" class="full-width" @click="goToLogin" />
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';
import { authReady, user } from 'src/firebase/firebase';
import { useRouter } from 'vue-router';

const { resetPassword } = useAuth();
const $q = useQuasar();
const router = useRouter();
const email = ref('');

onMounted(async () => {
  await authReady;
  if (user.value) {
    router.replace('/entries');
  }
});

const emailRule = (value) => /\S+@\S+\.\S+/.test(value) || 'Email must be a valid address';

const goToLogin = () => {
  router.push('/login');
};

const handleReset = async () => {
  try {
    await resetPassword(email.value);
    $q.notify({ color: 'positive', message: 'Reset link sent. Check your inbox.', position: 'top' });
    router.push('/login');
  } catch (error) {
    console.error('Error resetting password:', error.message);
    $q.notify({ color: 'negative', message: error.message || 'Unable to send reset link.', position: 'top' });
  }
};
</script>

<style scoped>
.reset-card {
  width: 100%;
  max-width: 420px;
}

.full-width {
  width: 100%;
}
</style>