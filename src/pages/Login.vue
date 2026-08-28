<script setup>
  import { onMounted, ref } from 'vue';
  import { useQuasar } from 'quasar';
  import {useAuth} from 'src/composables/useAuth';
  import { authReady, user } from 'src/firebase/firebase';
  import { useRoute, useRouter } from 'vue-router';
  
  const { loginUser } = useAuth();
  const $q = useQuasar();
  const route = useRoute();
  const router = useRouter();
  
  const email = ref('');
  const password = ref('');

  onMounted(async () => {
    await authReady;
    if (user.value) {
      router.replace('/entries');
    }
  });

  const emailRule = (val) => /\S+@\S+\.\S+/.test(val) || 'Email must be a valid address';

  const passwordRule = (val) => 
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(val) || 
    'Password must be at least 6 characters long and contain at least one number and one special character';


 const handleLogin = async () => {
  try {
    await loginUser(email.value, password.value);
    $q.notify({ color: 'positive', message: 'Login successful.', position: 'top' });
    const redirectTarget = typeof route.query.redirect === 'string' ? route.query.redirect : '/entries';
    router.push(redirectTarget);
  } catch (error) {
    console.error("Login error:", error.message);
    $q.notify({ color: 'negative', message: error.message || 'Unable to sign in.', position: 'top' });
  }
};
  const goToPasswordReset = () => {
    router.push('/passwordreset')
  }
  </script>
  
  <template>
    <q-page class="q-pa-md flex flex-center">
      <q-card class="login-card">
        <q-card-section class="text-center">
          <div class="text-h5 text-primary">Login to Your Account</div>
          <div class="text-caption text-grey">Enter your Gmail and password to continue</div>
        </q-card-section>
  
        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <!-- Email Field -->
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[emailRule]"
            outlined
            dense
            clearable
            prepend-icon="email"
            placeholder="Enter your Gmail address"
          />
  
          <!-- Password Field -->
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[passwordRule]"
            outlined
            dense
            clearable
            prepend-icon="lock"
            placeholder="Enter your password"
          />
  
          <!-- Login Button -->
          <q-btn
            label="Login"
            color="primary"
            unelevated
            type="submit"
            class="full-width q-mt-md"
          />
  
          <!-- Forgot Password Link -->
          <q-btn
            flat
            color="primary"
            label="Forgot Password?"
            @click="goToPasswordReset"
            class="full-width q-mt-sm"
          />
        </q-form>
      </q-card>
    </q-page>
  </template>

  <style scoped>
    .login-card {
        background: hsl(0deg 0% 100%);
		padding:  50px;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		border-radius: 12px;
		margin-top: -3em;
        max-width: 400px;
        width: 100%;

    }
    .full-width{
        width: 100%;
    }


  </style>
  