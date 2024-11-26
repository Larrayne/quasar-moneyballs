<template>
  <q-page class="pretty-page">


    <q-toolbar-title>
      <q-avatar size="42px">
        <img :src="user.profileImage || defaultImage" alt="Profile Image" />
      </q-avatar>
    </q-toolbar-title>


    <div class="q-pa-md">
      <q-list bordered separator class="entry-list">
        <q-slide-item 
          v-for="entry in entries" 
          :key="entry.id"
          @right="onEntrySlideRight($event, entry)"
          left-color="positive"
          right-color="negative"
        >
          <template v-slot:right>
            <q-icon name="delete_outline" />
          </template>
          <q-card class="entry-card shadow-3 rounded-borders">
            <q-card-section>
              <div class="entry-row">
              <div class="entry-column topic-column">
                <q-item-section :style="{ color: entry.color }" class="text-weight-bold text-primary text-h6">
                  {{ entry.name }}
                </q-item-section>
              </div>
              <div class="entry-column details-column">
                <q-item-section :style="{ color: entry.color }" class="text-weight-regular" side>
                  {{ entry.details }}
                </q-item-section>
              </div>
            </div>
              
            </q-card-section>
          </q-card>
        </q-slide-item>
      </q-list>
    </div>

    <q-footer class="bg-light-pink footer-bar">
      <div class="footer-title">
        Journal Entries
      </div>

      <q-form @submit.prevent="addEntry" class="form-entry shadow-2">
        <div class="col">
          <q-input v-model="addEntryForm.name"  ref="nameRef" placeholder="Journal Topic" bg-color="white" outlined dense class="input-box" />
        </div>
        <div class="col">
          <q-input v-model="addEntryForm.details" placeholder="Journal Details" outlined bg-color="white" type="textarea" dense class="input-box" />
        </div>
        <q-row class="q-gutter-sm">
          <q-col cols="auto">
            <q-btn round color="negative" icon="add_circle" type="submit" class="submit-btn" />
          </q-col>
          <q-col cols="auto">
            <q-btn round color="positive" icon="face" class="submit-btn" @click="goToAIChatPage" />
          </q-col>
        </q-row>
       
      </q-form>
    </q-footer>
  </q-page>
</template>



















<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { setDoc, getDocs, collection, onSnapshot, serverTimestamp, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from 'src/firebase/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();
const $q = useQuasar();
const colors = ['#FFADAD', '#FFDAC1', '#FFD6E0', '#B5EAD7', '#C7CEEA', '#FFC8A2'];
const entries = ref([]);
const nameRef = ref(null);

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
    console.error("User not authenticated");
    return;
  }

  const entriesRef = collection(db, 'users', userId, 'entries');
  onSnapshot(entriesRef, (querySnapshot) => {
    const entriesFB = [];
    querySnapshot.forEach((doc) => {
      const entry = doc.data();
      entry.id = doc.id;
      entriesFB.push(entry);
    });
    entries.value = entriesFB;
  });
};

const addEntry = async () => {
  const userId = getUserId();
  if (!userId) {
    console.error("User not authenticated");
    return;
  }

  const newEntry = {
    ...addEntryForm,
    color: colors[entries.value.length % colors.length],
    timestamp: serverTimestamp(),
  };

  await addDoc(collection(db, 'users', userId, 'entries'), newEntry);
  Object.assign(addEntryForm, addEntryFormDefault);
  nameRef.value.focus();
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
    console.error("User not authenticated");
    return;
  }

  await deleteDoc(doc(db, 'users', userId, 'entries', entryId));
  entries.value = entries.value.filter(entry => entry.id !== entryId);
  $q.notify({ color: 'positive', message: 'Entry Deleted', position: 'top' });
};

onMounted(() => {
  loadEntries();
});

const journalView = ref('list');  // This will come from the settings page
const fontSize = ref('medium');   // This will come from the settings page
const fontStyle = ref('Arial');   // This will come from the settings page

const entryStyle = computed(() => ({
  fontSize: fontSize.value === 'small' ? '14px' : fontSize.value === 'large' ? '18px' : '16px',
  fontFamily: fontStyle.value
}));


function goToAIChatPage() {
  router.push({ name: 'AIChatPage' }); // or use { path: '/ai-chat' }
}


const user = ref({
  username: '',
  bio: '',
  profileImage: 'https://bootdey.com/img/Content/avatar/avatar3.png',
});


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
.pretty-page {
  background-color: #FFF1F4;
  padding-bottom: 100px;
}

.entry-card {
  background-color: #830245;
  border-radius: 12px;
  margin-bottom: 8px;
  padding: 12px;
}

.entry-list {
  background-color: #FFE6F7;
  border-radius: 12px;
  padding: 12px;
}

.footer-bar {
  background-color: #FFD1DC;
}

.footer-title {
  font-weight: bold;
  font-size: 1.2em;
  color: #AD1457;
  text-align: center;
  padding-top: 12px;
}

.form-entry {
  background-color: #FFCCEE;
  border-radius: 12px;
  padding: 12px;
  margin-top: 16px;
}

.input-box {
  border-radius: 8px;
}

.submit-btn {
  background-color: #FF69B4;
  color: #fff;
}


.journal-entries.list .entry-item {
  padding: 8px;
}

.journal-entries.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.journal-entries.timeline .timeline-item {
  position: relative;
  margin-bottom: 16px;
}

.timeline-item::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 100%;
  background-color: #ccc;
  left: 0;
  top: 0;
}
</style>
