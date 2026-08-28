<template>
  <q-page class="entries-page">
    <section class="entries-hero q-mb-md">
      <div>
        <div class="hero-kicker">Journal Space</div>
        <h1 class="hero-title">Your entries, one honest line at a time.</h1>
        <p class="hero-subtitle">{{ entryCountLabel }}</p>
      </div>

      <q-avatar size="58px" class="profile-avatar">
        <img :src="user.profileImage || defaultImage" alt="Profile Image" />
      </q-avatar>
    </section>

    <section class="entries-board" :style="entryStyle">
      <div v-if="entries.length === 0" class="empty-state">
        <q-icon name="auto_stories" size="40px" class="q-mb-sm" />
        <h2 class="empty-title">No entries yet</h2>
        <p class="empty-copy">Start with a topic and a short reflection below. Your first entry will appear here instantly.</p>
      </div>

      <q-list
        v-else
        separator
        class="entry-list"
        :class="[`entry-list--${journalView}`]"
      >
        <q-slide-item
          v-for="entry in entries"
          :key="entry.id"
          @right="onEntrySlideRight($event, entry)"
          right-color="negative"
        >
          <template v-slot:right>
            <q-icon name="delete_outline" size="22px" />
          </template>

          <q-card class="entry-card" flat>
            <q-card-section>
              <div class="entry-headline">
                <div class="entry-topic" :style="{ color: entry.color }">{{ entry.name }}</div>
                <div class="entry-date">{{ formatEntryTimestamp(entry.timestamp) }}</div>
              </div>
              <div class="entry-details">{{ entry.details }}</div>
            </q-card-section>
          </q-card>
        </q-slide-item>
      </q-list>
    </section>

    <q-page-sticky position="bottom" :offset="[0, 14]" class="composer-wrap">
      <q-card class="composer-card shadow-4" flat>
        <q-form @submit.prevent="addEntry" class="q-gutter-sm">
          <div class="composer-header">New Entry</div>

          <q-input
            v-model="addEntryForm.name"
            ref="nameRef"
            placeholder="Topic"
            bg-color="white"
            outlined
            dense
          />

          <q-input
            v-model="addEntryForm.details"
            placeholder="What happened, and what did you feel?"
            outlined
            bg-color="white"
            type="textarea"
            autogrow
            dense
          />

          <div class="composer-actions">
            <q-btn
              label="Save Entry"
              icon="add_circle"
              type="submit"
              color="primary"
              unelevated
            />
            <q-btn
              label="Need a Prompt"
              icon="face"
              color="secondary"
              outline
              @click="goToAIChatPage"
            />
          </div>
        </q-form>
      </q-card>
    </q-page-sticky>
  </q-page>
</template>



















<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue';
import { useQuasar } from 'quasar';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { auth, db } from 'src/firebase/firebase';
import { default as defaultAvatar } from 'src/assets/quasar-logo-vertical.svg';
import { getUserSettings } from 'src/composables/useUserPreferences';
import { useRouter } from 'vue-router';

const router = useRouter();
const $q = useQuasar();
const colors = ['#FFADAD', '#FFDAC1', '#FFD6E0', '#B5EAD7', '#C7CEEA', '#FFC8A2'];
const entries = ref([]);
const nameRef = ref(null);
const defaultImage = defaultAvatar;
const user = ref({
  profileImage: defaultImage,
});
const journalView = ref('list');
const fontSize = ref('medium');
const fontStyle = ref('Arial');
let unsubscribeEntries = null;

const entryCountLabel = computed(() => {
  const count = entries.value.length;
  if (count === 0) {
    return 'You have no saved entries yet.';
  }
  if (count === 1) {
    return 'You have 1 saved entry.';
  }
  return `You have ${count} saved entries.`;
});

const getUserId = () => {
  return auth.currentUser ? auth.currentUser.uid : null;
};

const addEntryFormDefault = {
  name: '',
  details: '',
};
const addEntryForm = reactive({ ...addEntryFormDefault });

const loadEntries = () => {
  const userId = getUserId();
  if (!userId) {
    unsubscribeEntries?.();
    entries.value = [];
    console.error('User not authenticated');
    return;
  }

  unsubscribeEntries?.();
  const entriesRef = query(collection(db, 'users', userId, 'entries'), orderBy('timestamp', 'desc'));
  unsubscribeEntries = onSnapshot(
    entriesRef,
    (querySnapshot) => {
      const entriesFB = [];
      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        entry.id = doc.id;
        entriesFB.push(entry);
      });
      entries.value = entriesFB;
    },
    (error) => {
      console.error('Failed to sync entries', error);
      $q.notify({ color: 'negative', message: 'Unable to sync entries right now.', position: 'top' });
      entries.value = [];
    }
  );
};

const handleExpiredSession = () => {
  $q.notify({ color: 'warning', message: 'Your session expired. Please log in again.', position: 'top' });
  router.push('/login');
};

const addEntry = async () => {
  const userId = getUserId();
  if (!userId) {
    handleExpiredSession();
    return;
  }

  if (!addEntryForm.name.trim() || !addEntryForm.details.trim()) {
    $q.notify({ color: 'warning', message: 'Please add both a topic and details before saving.', position: 'top' });
    return;
  }

  const newEntry = {
    name: addEntryForm.name.trim(),
    details: addEntryForm.details.trim(),
    color: colors[entries.value.length % colors.length],
    timestamp: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, 'users', userId, 'entries'), newEntry);
    Object.assign(addEntryForm, addEntryFormDefault);
    nameRef.value?.focus();
  } catch (error) {
    console.error('Failed to save entry', error);
    $q.notify({ color: 'negative', message: 'Could not save entry. Try again.', position: 'top' });
  }
};

const onEntrySlideRight = ({ reset }, entry) => {
  $q.dialog({
    title: 'Delete Entry',
    message: `Are you sure you want to delete this entry?<div class="q-mt-md text-weight-bold">${entry.name}: ${entry.details}</div>`,
    cancel: true,
    persistent: true,
    html: true,
    ok: { label: 'Delete', color: 'negative' },
    cancel: { color: 'positive' },
  }).onOk(() => {
    deleteEntry(entry.id);
  }).onCancel(() => {
    reset();
  });
};

const deleteEntry = async (entryId) => {
  const userId = getUserId();
  if (!userId) {
    handleExpiredSession();
    return;
  }

  try {
    await deleteDoc(doc(db, 'users', userId, 'entries', entryId));
    entries.value = entries.value.filter(entry => entry.id !== entryId);
    $q.notify({ color: 'positive', message: 'Entry deleted.', position: 'top' });
  } catch (error) {
    console.error('Failed to delete entry', error);
    $q.notify({ color: 'negative', message: 'Could not delete entry. Try again.', position: 'top' });
  }
};

const loadUserPreferences = async () => {
  const userId = getUserId();
  if (!userId) {
    return;
  }

  try {
    const settings = await getUserSettings(userId);
    journalView.value = settings.journalView;
    fontSize.value = settings.fontSize;
    fontStyle.value = settings.fontStyle;
    user.value.profileImage = settings.profileImage || defaultImage;
  } catch (error) {
    console.error('Error loading user preferences', error);
  }
};


onMounted(() => {
  loadEntries();
  loadUserPreferences();
});

onBeforeUnmount(() => {
  unsubscribeEntries?.();
});

const entryStyle = computed(() => ({
  fontSize: fontSize.value === 'small' ? '14px' : fontSize.value === 'large' ? '18px' : '16px',
  fontFamily: fontStyle.value
}));

function formatEntryTimestamp(timestamp) {
  if (!timestamp || !timestamp.toDate) {
    return 'Just now';
  }

  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}


function goToAIChatPage() {
  router.push({ name: 'AIChatPage' }); // or use { path: '/ai-chat' }
}
</script>








<style scoped>
.entries-page {
  padding: 18px 18px 170px;
}

.entries-hero {
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
  font-size: clamp(1.55rem, 3.4vw, 2.4rem);
  line-height: 1.1;
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

.entries-board {
  margin-top: 14px;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(117, 78, 57, 0.1);
  background: rgba(255, 255, 255, 0.58);
  min-height: 280px;
}

.empty-state {
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  color: rgba(49, 33, 26, 0.78);
}

.empty-title {
  margin: 8px 0 6px;
  font-size: 1.25rem;
  color: #31211a;
}

.empty-copy {
  margin: 0;
  max-width: 52ch;
  line-height: 1.7;
}

.entry-list {
  background: transparent;
  border-radius: 14px;
}

.entry-list--list {
  display: block;
}

.entry-list--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.entry-list--grid :deep(.q-slide-item) {
  margin-bottom: 0;
}

.entry-list--timeline {
  position: relative;
  padding-left: 20px;
}

.entry-list--timeline::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 10px;
  bottom: 12px;
  width: 2px;
  background: rgba(216, 91, 147, 0.4);
}

.entry-list--timeline :deep(.q-slide-item) {
  position: relative;
}

.entry-list--timeline :deep(.q-slide-item)::before {
  content: '';
  position: absolute;
  left: -18px;
  top: 24px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d85b93;
  box-shadow: 0 0 0 3px rgba(216, 91, 147, 0.18);
}

.entry-card {
  border-radius: 14px;
  margin-bottom: 10px;
  background: #fff7f2;
  border: 1px solid rgba(117, 78, 57, 0.12);
}

.entry-list--grid .entry-card {
  height: 100%;
  margin-bottom: 0;
}

.entry-list--timeline .entry-card {
  background: rgba(255, 247, 242, 0.92);
}

.entry-headline {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
}

.entry-topic {
  font-size: 1.08rem;
  font-weight: 700;
}

.entry-date {
  font-size: 0.78rem;
  color: rgba(49, 33, 26, 0.58);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

@media (max-width: 680px) {
  .entry-list--grid {
    grid-template-columns: 1fr;
  }
}

.entry-details {
  margin-top: 8px;
  line-height: 1.65;
  color: #402d23;
  white-space: pre-wrap;
}

.composer-wrap {
  width: min(860px, calc(100vw - 22px));
}

.composer-card {
  width: 100%;
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 246, 240, 0.95);
  border: 1px solid rgba(117, 78, 57, 0.12);
}

.composer-header {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #8b5e46;
}

.composer-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .entries-page {
    padding: 14px 14px 178px;
  }

  .entries-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .composer-wrap {
    width: calc(100vw - 14px);
  }
}
</style>
