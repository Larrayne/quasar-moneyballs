<template>
  <q-page class="q-pa-md">
    <q-card class="register-card shadow-2">
      <q-card-section class="text-center">
        <div class="text-h5 text-primary">Register</div>
        <div class="text-caption text-grey">Enter your details to register for an account</div>
      </q-card-section>
      
      <q-form @submit.prevent="handleRegister" class="q-gutter-md">
        <q-input 
          v-model="name" 
          label="Name" 
          type="text"
          clearable
          outlined
          dense />

        <q-input
          v-model="nickname" 
          label="Nickname" 
          type="text" 
          clearable
          outlined
          dense />

        <q-input 
          v-model="surname" 
          label="Surname" 
          type="text" 
          clearable
          outlined
          dense />

        <q-input 
          v-model="dob" 
          label="Date of Birth" 
          type="date" 
          min="1900-01-01" 
          max="2023-12-31" 
          placeholder="YYYY-MM-DD" 
          clearable
          outlined
          dense />

        <q-input 
          v-model="email" 
          label="Email" 
          type="email"
          clearable
          placeholder="Enter your Gmail address" 
          prepend-icon="email"
          :rules="[emailRule]"
          outlined
          dense />

        <q-input 
          v-model="password" 
          label="Password" 
          type="password"
          clearable
          :rules="[passwordRule]"
          prepend-icon="lock" 
          outlined
          placeholder="Please set your password"
          dense />

        <q-btn 
          label="Register" 
          type="submit" 
          color="primary" 
          unelevated
          round
          icon="meeting_room"
          class="full-width q-mt-md shadow-2" />

        <q-btn 
          
          label="Google Sign-In Unavailable" 
          @click="notifyGoogleUnavailable" 
          color="secondary" 
          round
          unelevated
          class="full-width q-ml-md q-mt-md" />
      </q-form>
    </q-card>
  </q-page>
</template>

<style scoped>
  .register-card {
    background: hsl(0, 0%, 100%);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1em;
    border-radius: 12px;
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }

  .full-width {
    width: 100%;
  }

  .q-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .q-card {
    max-width: 450px;
    width: 100%;
  }

  /* Subtle hover effect for the buttons */
  .q-btn:hover {
    background-color: #2C8FC9;
    color: white;
    transform: translateY(-2px);
  }

  .q-btn.flat:hover {
    background-color: transparent;
    color: #2C8FC9;
  }

  /* Responsive adjustments for smaller screens */
  @media (max-width: 600px) {
    .register-card {
      padding: 1.5rem;
      max-width: 95%;
    }
  }
</style>

























<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useAuth } from 'src/composables/useAuth';
import { saveUserSettings } from 'src/composables/useUserPreferences';
import { authReady, updateProfile, user } from 'src/firebase/firebase';
import { useRouter } from 'vue-router';

const { registerUser } = useAuth();
const $q = useQuasar();
const router = useRouter();

const name = ref('');
const nickname = ref('');
const surname = ref('');
const dob = ref('');
const email = ref('');
const password = ref('');

const emailRule = (val) => /\S+@\S+\.\S+/.test(val) || 'Email must be a valid address';


const passwordRule = (val) => 
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(val) || 
    'Password must be at least 6 characters long and contain at least one number and one special character';



onMounted(async () => {
  await authReady;
  if (user.value) {
    router.replace('/entries');
  }
});

const handleRegister = async () => {
  try {
    const registeredUser = await registerUser(email.value, password.value);
    const displayName = [name.value, surname.value].map((value) => value.trim()).filter(Boolean).join(' ') || nickname.value.trim();

    if (displayName) {
      await updateProfile(registeredUser, { displayName });
    }

    await saveUserSettings(registeredUser.uid, {
      displayName,
      name: name.value.trim(),
      nickname: nickname.value.trim(),
      surname: surname.value.trim(),
      dob: dob.value,
    });

    $q.notify({ color: 'positive', message: 'Registration successful. Verify your email before logging in.', position: 'top' });
    router.push('/registrationsuccess');
  } catch (error) {
    console.error("Registration error:", error.message);
    $q.notify({ color: 'negative', message: error.message || 'Unable to register.', position: 'top' });
  }
};

const notifyGoogleUnavailable = () => {
  $q.notify({ color: 'warning', message: 'Google sign-in is not configured yet.', position: 'top' });
};


</script>
