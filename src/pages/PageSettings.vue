<template>
  <q-page class="container q-pa-none">
    <h1 class="text-h5 q-mb-md">Settings</h1>

    <q-layout>
      <q-page-container>
        <q-row>
          <q-col cols="12" md="5" xl="4">
            <q-card>
              <q-card-section>
                <h5 class="text-h6">Profile Settings</h5>
              </q-card-section>
              <q-list bordered class="rounded-borders">
                <q-item clickable v-for="item in settingsOptions" :key="item.label" @click="activeTab = item.tab">
                  <q-item-section>{{ item.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-col>

          <q-col cols="12" md="7" xl="8">
            <q-tab-panels v-model="activeTab" animated>
              <!-- Account Tab -->
              <q-tab-panel name="account">
                <q-card>
                  <q-card-section>
                    <div class="q-card-actions text-right">
                      <q-btn flat dense icon="more_vert" />
                    </div>
                    <h5 class="text-h6">Public Info</h5>
                  </q-card-section>

                  <q-card-section>
                    <q-form @submit="saveAccountInfo">
                      <q-input filled label="Display Name" v-model="displayName" />
                      <q-input filled label="Biography" type="textarea" v-model="user.bio" rows="2" />

                      <div class="q-mt-md text-center">
                        <q-avatar size="128px">
                          <img :src="profilePictureUrl || user.profileImage" alt="Profile Image" />
                        </q-avatar>
                        <q-uploader v-model="file" label="Upload Profile Picture" accept="image/*" @added="uploadProfilePicture" />
                        <small class="d-block">For best results, use an image at least 128px by 128px in .jpg format</small>
                      </div>
                      <q-btn type="submit" color="primary" label="Save changes" class="q-mt-md" />
                    </q-form>
                  </q-card-section>
                </q-card>
              </q-tab-panel>

              <!-- Password Tab -->
              <q-tab-panel name="password">
                <q-card>
                  <q-card-section>
                    <h5 class="text-h6">Password</h5>
                  </q-card-section>
                  <q-card-section>
                    <q-form @submit="savePassword">
                      <q-input filled type="password" label="Current password" v-model="password.current" />
                      <q-input filled type="password" label="New password" v-model="password.new" />
                      <q-input filled type="password" label="Verify password" v-model="password.verify" />
                      <q-btn type="submit" color="primary" label="Save changes" class="q-mt-md" />
                    </q-form>
                  </q-card-section>
                </q-card>
              </q-tab-panel>

              <!-- Notifications Tab -->
              <q-tab-panel name="notifications">
                <q-card>
                  <q-card-section>
                    <h5 class="text-h6">Notifications</h5>
                  </q-card-section>
                  <q-card-section>
                    <q-toggle v-model="emailNotifications" label="Receive Email Notifications" color="primary" />
                    <q-btn color="primary" @click="updateNotificationSettings" label="Save Changes" class="q-mt-md" />
                  </q-card-section>
                </q-card>
              </q-tab-panel>

              <!-- Preferences Tab -->
              <q-tab-panel name="preferences">
                <q-card>
                  <q-card-section>
                    <h5 class="text-h6">Preferences</h5>
                  </q-card-section>
                  <q-card-section>
                    <q-select v-model="themeColor" :options="themeOptions" label="Theme Color" @input="updateThemeColor" />
                    <q-select v-model="fontSize" :options="fontSizeOptions" label="Font Size" @input="updateFontSize" />
                    <q-select v-model="fontStyle" :options="fontStyleOptions" label="Font Style" @input="updateFontStyle" />
                    <q-select v-model="journalView" :options="journalViewOptions" label="Journal View" @input="updateJournalView" />
                  </q-card-section>
                </q-card>
              </q-tab-panel>

              <!-- Security Tab -->
              <q-tab-panel name="security">
                <q-card>
                  <q-card-section>
                    <h5 class="text-h6">Security</h5>
                  </q-card-section>
                  <q-card-section>
                    <q-toggle v-model="twoFactorEnabled" label="Enable Two-Factor Authentication" @input="toggle2FA" />
                  </q-card-section>
                </q-card>
              </q-tab-panel>

              <!-- Delete Account Tab -->
              <q-tab-panel name="deleteAccount">
                <q-card>
                  <q-card-section>
                    <h5 class="text-h6">Account Deletion</h5>
                  </q-card-section>
                  <q-card-section>
                    <q-btn color="negative" label="Delete Account" @click="confirmDeleteAccount" />
                  </q-card-section>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </q-col>
        </q-row>
      </q-page-container>
    </q-layout>
  </q-page>
</template>


<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { auth, db, storage } from 'src/firebase/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../composables/useAuth';

const $q = useQuasar();
const activeTab = ref("account");
const displayName = ref('');
const file = ref(null);
const profilePictureUrl = ref('');
const emailNotifications = ref(false);
const twoFactorEnabled = ref(false);
const themeColor = ref('');
const fontSize = ref('');
const fontStyle = ref('');
const journalView = ref('');
const defaultImage = 'https://bootdey.com/img/Content/avatar/avatar3.png';

const { changeUserPassword, deleteUserAccount, enableTwoFactorAuth } = useAuth();

const user = ref({
  username: '',
  bio: '',
  profileImage: 'https://bootdey.com/img/Content/avatar/avatar3.png',
}); 

const password = ref({
  current: '',
  new: '',
  verify: ''
});

const settingsOptions = [
  { label: 'Account', tab: 'account' },
  { label: 'Password', tab: 'password' },
  { label: 'Notifications', tab: 'notifications' },
  { label: 'Preferences', tab: 'preferences' },
  { label: 'Security', tab: 'security' },
  { label: 'Delete Account', tab: 'deleteAccount' },
];

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'Pastel', value: 'pastel' }
];


const fontSizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' }
];

const fontStyleOptions = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' }
];




const journalViewOptions = [
  { label: 'List', value: 'list' },
  { label: 'Grid', value: 'grid' },
  { label: 'Timeline', value: 'timeline' }
];

// Additional functions here
function saveAccountInfo() {
  // Handle saving account information here
  $q.notify({ color: 'positive', message: 'Account info saved!',position: 'center' });
}

function savePassword() {
  // Handle saving new password here
  if (password.value.new !== password.value.verify) {
    $q.notify({ color: 'negative', message: 'Passwords do not match!',position: 'center' });
    return;
  }
  $q.notify({ color: 'positive', message: 'Password updated successfully!',position: 'top' });
}

// function uploadImage() {
//   // Handle image upload here
//   $q.notify({ color: 'negative', message: 'Image upload functionality not yet implemented.' });
// }

async function uploadImage(files) {
  const selectedFile = files[0];
  
  if (selectedFile) {
    try {
      // Create a unique storage reference
      const imageRef = storageRef(storage, `profilePictures/${selectedFile.name}`);
      
      // Upload file to Firebase Storage
      await uploadBytes(imageRef, selectedFile);
      
      // Get and set the download URL as the profile picture
      user.value.profileImage = await getDownloadURL(imageRef);
      
      $q.notify({ color: 'positive', message: 'Profile image uploaded successfully!',position: 'center' });
    } catch (error) {
      console.error("Error uploading image:", error);
      $q.notify({ color: 'negative', message: 'Error uploading image!',position: 'center' });
    }
  }
}
</script>

<style scoped>

.q-page {
  max-width: 100%;
}

.container {
  max-width: 100%;
}
.theme-light { --primary-bg: #ffffff; --primary-text: #000000; }
.theme-dark { --primary-bg: #333333; --primary-text: #ffffff; }
.theme-pastel { --primary-bg: #f0e6f6; --primary-text: #3a3a3a; }
:root {
  --font-size-small: 14px;
  --font-size-medium: 16px;
  --font-size-large: 18px;
  --font-family: Arial, sans-serif;
}
body {
  background-color: var(--primary-bg);
  color: var(--primary-text);
  font-size: var(--font-size);
  font-family: var(--font-family);
}
</style>
