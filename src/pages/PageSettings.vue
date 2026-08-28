<template>
  <q-page class="settings-page">
    <section class="settings-hero q-mb-md">
      <div>
        <div class="hero-kicker">Personalization</div>
        <h1 class="hero-title">Settings that stay with you.</h1>
        <p class="hero-subtitle">{{ activeTabLabel }}</p>
      </div>
      <q-avatar size="58px" class="profile-avatar">
        <img :src="profilePictureUrl || user.profileImage" alt="Profile Image" />
      </q-avatar>
    </section>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4 col-xl-3">
        <q-card class="menu-card" flat>
          <q-card-section>
            <h5 class="text-h6 q-my-none">Profile Settings</h5>
            <p class="menu-caption q-mt-sm q-mb-none">Adjust your account, writing experience, and security preferences.</p>
          </q-card-section>
          <q-list class="menu-list">
            <q-item
              clickable
              v-for="item in settingsOptions"
              :key="item.label"
              @click="activeTab = item.tab"
              :class="['menu-item', { 'menu-item--active': activeTab === item.tab }]"
            >
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-8 col-xl-9">
        <q-tab-panels v-model="activeTab" animated class="panel-shell">
          <q-tab-panel name="account">
            <q-card class="panel-card" flat>
              <q-card-section>
                <h5 class="text-h6 q-my-none">Public Info</h5>
              </q-card-section>

              <q-card-section>
                <q-form @submit.prevent="saveAccountInfo" class="q-gutter-md">
                  <q-input filled label="Display Name" v-model="displayName" />
                  <q-input filled label="Biography" type="textarea" v-model="bio" rows="3" />

                  <div class="q-mt-md text-center">
                    <q-avatar size="128px">
                      <img :src="profilePictureUrl || user.profileImage" alt="Profile Image" />
                    </q-avatar>
                    <q-file
                      filled
                      clearable
                      accept="image/*"
                      label="Upload Profile Picture"
                      @update:model-value="uploadProfilePicture"
                    />
                    <small class="d-block">Profile changes are stored in your Firebase user document.</small>
                  </div>

                  <q-btn type="submit" color="primary" label="Save Changes" />
                </q-form>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="password">
            <q-card class="panel-card" flat>
              <q-card-section>
                <h5 class="text-h6 q-my-none">Password</h5>
              </q-card-section>
              <q-card-section>
                <q-form @submit.prevent="savePassword" class="q-gutter-md">
                  <q-input filled type="password" label="Current password" v-model="password.current" />
                  <q-input filled type="password" label="New password" v-model="password.new" />
                  <q-input filled type="password" label="Verify password" v-model="password.verify" />
                  <q-btn type="submit" color="primary" label="Save Changes" />
                </q-form>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="notifications">
            <q-card class="panel-card" flat>
              <q-card-section>
                <h5 class="text-h6 q-my-none">Notifications</h5>
              </q-card-section>
              <q-card-section>
                <q-toggle v-model="emailNotifications" label="Receive Email Notifications" color="primary" />
                <div class="q-mt-md">
                  <q-btn color="primary" @click="saveNotifications" label="Save Changes" />
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="preferences">
            <q-card class="panel-card" flat>
              <q-card-section>
                <h5 class="text-h6 q-my-none">Preferences</h5>
              </q-card-section>
              <q-card-section class="q-gutter-md">
                <q-select v-model="themeColor" :options="themeOptions" emit-value map-options label="Theme Color" />
                <q-select v-model="fontSize" :options="fontSizeOptions" emit-value map-options label="Font Size" />
                <q-select v-model="fontStyle" :options="fontStyleOptions" emit-value map-options label="Font Style" />
                <q-select v-model="journalView" :options="journalViewOptions" emit-value map-options label="Journal View" />
                <q-btn color="primary" @click="savePreferences" label="Save Preferences" />
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="security">
            <q-card class="panel-card" flat>
              <q-card-section>
                <h5 class="text-h6 q-my-none">Security</h5>
              </q-card-section>
              <q-card-section>
                <q-banner rounded class="bg-grey-2 text-grey-8">
                  Two-factor authentication is not configured in this Firebase project yet. The toggle has been disabled to avoid implying unsupported behavior.
                </q-banner>
                <q-toggle class="q-mt-md" :model-value="false" disable label="Two-Factor Authentication" />
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="deleteAccount">
            <q-card class="panel-card" flat>
              <q-card-section>
                <h5 class="text-h6 q-my-none">Account Deletion</h5>
              </q-card-section>
              <q-card-section>
                <p class="text-body2 text-grey-8">This removes your authenticated Firebase account. Firebase may still require a recent login before allowing the deletion.</p>
                <q-btn color="negative" label="Delete Account" @click="confirmDeleteAccount" />
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>


<script setup>
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { auth, authReady, storage, updateProfile } from 'src/firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { applyUserPreferences, getUserSettings, saveUserSettings } from 'src/composables/useUserPreferences';

const $q = useQuasar();
const router = useRouter();
const activeTab = ref('account');
const displayName = ref('');
const bio = ref('');
const profilePictureUrl = ref('');
const emailNotifications = ref(false);
const themeColor = ref('light');
const fontSize = ref('medium');
const fontStyle = ref('Arial');
const journalView = ref('list');
const defaultImage = 'https://bootdey.com/img/Content/avatar/avatar3.png';

const { changePassword, deleteUserAccount } = useAuth();

const user = ref({
  profileImage: defaultImage,
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

const activeTabLabel = computed(() => {
  const activeOption = settingsOptions.find((item) => item.tab === activeTab.value);
  return activeOption ? `You are editing: ${activeOption.label}` : 'Manage your settings.';
});

const themeOptions = [
  { label: 'Light', value: 'light' },
  { label: 'Dark Pink', value: 'darkPink' },
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
  return persistAccountInfo();
}

async function savePassword() {
  if (!password.value.current || !password.value.new || !password.value.verify) {
    $q.notify({ color: 'warning', message: 'Please complete all password fields.', position: 'top' });
    return;
  }

  if (password.value.new !== password.value.verify) {
    $q.notify({ color: 'negative', message: 'Passwords do not match!', position: 'center' });
    return;
  }

  try {
    await changePassword(password.value.current, password.value.new);
    password.value = { current: '', new: '', verify: '' };
    $q.notify({ color: 'positive', message: 'Password updated successfully!', position: 'top' });
  } catch (error) {
    $q.notify({ color: 'negative', message: error.message || 'Unable to update password.', position: 'top' });
  }
}

async function uploadProfilePicture(fileInput) {
  const selectedFile = Array.isArray(fileInput) ? fileInput[0] : fileInput;

  if (selectedFile) {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not authenticated.');
      }

      const imageRef = storageRef(storage, `profilePictures/${currentUser.uid}/${Date.now()}-${selectedFile.name}`);
      await uploadBytes(imageRef, selectedFile);

      profilePictureUrl.value = await getDownloadURL(imageRef);
      user.value.profileImage = profilePictureUrl.value;
      $q.notify({ color: 'positive', message: 'Profile image uploaded successfully!', position: 'center' });
    } catch (error) {
      console.error('Error uploading image:', error);
      $q.notify({ color: 'negative', message: 'Error uploading image!', position: 'center' });
    }
  }
}

async function persistAccountInfo() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated.');
    }

    const normalizedDisplayName = displayName.value.trim();
    const normalizedBio = bio.value.trim();
    const normalizedPhoto = profilePictureUrl.value || user.value.profileImage || defaultImage;

    const updatedSettings = await saveUserSettings(currentUser.uid, {
      displayName: normalizedDisplayName,
      bio: normalizedBio,
      profileImage: normalizedPhoto,
    });

    await updateProfile(currentUser, {
      displayName: normalizedDisplayName,
      photoURL: normalizedPhoto,
    });

    displayName.value = updatedSettings.displayName || normalizedDisplayName;
    bio.value = updatedSettings.bio || normalizedBio;
    user.value.profileImage = updatedSettings.profileImage || normalizedPhoto;
    profilePictureUrl.value = updatedSettings.profileImage || normalizedPhoto;

    $q.notify({ color: 'positive', message: 'Account info saved!', position: 'center' });
  } catch (error) {
    $q.notify({ color: 'negative', message: error.message || 'Unable to save account info.', position: 'center' });
  }
}

async function saveNotifications() {
  try {
    const currentUser = auth.currentUser;
    await saveUserSettings(currentUser?.uid, {
      emailNotifications: emailNotifications.value,
    });
    $q.notify({ color: 'positive', message: 'Notification settings saved!', position: 'center' });
  } catch (error) {
    $q.notify({ color: 'negative', message: error.message || 'Unable to save notification settings.', position: 'center' });
  }
}

async function savePreferences() {
  try {
    const currentUser = auth.currentUser;
    const settings = await saveUserSettings(currentUser?.uid, {
      themeColor: themeColor.value,
      fontSize: fontSize.value,
      fontStyle: fontStyle.value,
      journalView: journalView.value,
    });
    applyUserPreferences(settings);
    $q.notify({ color: 'positive', message: 'Preferences saved!', position: 'center' });
  } catch (error) {
    $q.notify({ color: 'negative', message: error.message || 'Unable to save preferences.', position: 'center' });
  }
}

async function loadSettings() {
  await authReady;
  const currentUser = auth.currentUser;
  if (!currentUser) {
    $q.notify({ color: 'warning', message: 'Please log in to manage settings.', position: 'top' });
    router.replace({ path: '/login', query: { redirect: '/settings' } });
    return;
  }

  try {
    const settings = await getUserSettings(currentUser.uid);
    displayName.value = settings.displayName || currentUser.displayName || '';
    bio.value = settings.bio || '';
    user.value.profileImage = settings.profileImage || currentUser.photoURL || defaultImage;
    profilePictureUrl.value = settings.profileImage || '';
    emailNotifications.value = settings.emailNotifications;
    themeColor.value = settings.themeColor;
    fontSize.value = settings.fontSize;
    fontStyle.value = settings.fontStyle;
    journalView.value = settings.journalView;
    applyUserPreferences(settings);
  } catch (error) {
    $q.notify({ color: 'negative', message: 'Unable to load settings.', position: 'top' });
  }
}

function confirmDeleteAccount() {
  $q.dialog({
    title: 'Delete Account',
    message: 'This will permanently remove your Firebase account. Continue?',
    cancel: true,
    persistent: true,
    ok: { color: 'negative', label: 'Delete' },
  }).onOk(async () => {
    try {
      await deleteUserAccount();
      $q.notify({ color: 'positive', message: 'Account deleted.', position: 'top' });
      router.push('/');
    } catch (error) {
      $q.notify({ color: 'negative', message: error.message || 'Unable to delete account.', position: 'top' });
    }
  });
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.settings-page {
  padding: 18px;
}

.settings-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(117, 78, 57, 0.12);
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.76), transparent 36%),
    linear-gradient(120deg, #fff7f3 0%, #ffe4d5 54%, #f9d7dc 100%);
}

.hero-kicker {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8b5e46;
}

.hero-title {
  margin: 8px 0 0;
  font-size: clamp(1.5rem, 3.3vw, 2.2rem);
  line-height: 1.15;
  color: #31211a;
}

.hero-subtitle {
  margin: 10px 0 0;
  color: rgba(49, 33, 26, 0.78);
}

.profile-avatar {
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 24px rgba(74, 40, 27, 0.16);
}

.menu-card {
  border-radius: 18px;
  border: 1px solid rgba(117, 78, 57, 0.12);
  background: rgba(255, 248, 243, 0.94);
}

.menu-caption {
  color: rgba(49, 33, 26, 0.72);
  font-size: 0.92rem;
  line-height: 1.5;
}

.menu-list {
  padding: 4px 10px 12px;
}

.menu-item {
  margin-bottom: 6px;
  border-radius: 12px;
  color: #51382b;
}

.menu-item--active {
  background: rgba(255, 232, 219, 0.9);
  color: #2f1f17;
  font-weight: 700;
}

.panel-shell {
  border-radius: 18px;
  background: transparent;
}

.panel-card {
  border-radius: 18px;
  border: 1px solid rgba(117, 78, 57, 0.12);
  background: rgba(255, 250, 245, 0.95);
}

@media (max-width: 640px) {
  .settings-page {
    padding: 14px;
  }

  .settings-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
