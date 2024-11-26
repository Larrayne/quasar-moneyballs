<template>
  <q-page class="container q-pa-md">
    <h1 class="text-h5">🤖AI Companion🤖</h1>
    <q-card class="q-pa-md">
      <q-list>
        <q-item v-for="message in messages" :key="message.id">
          <q-item-section>{{ message.text }}</q-item-section>
        </q-item>
      </q-list>
      <q-input v-model="userInput" placeholder="Type your message..." @keyup.enter="sendMessage" />
      <q-btn label="Send" @click="sendMessage" color="accent"  />
      <div class="col col-auto">
        <q-btn
        label="Go to Entries"
          color="negative"
          icon="first_page"
          class="q-mt-md"
          @click="goToEntries"
        />

      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const userInput = ref('');
const messages = ref([]);

const router = useRouter();

async function sendMessage() {
  if (!userInput.value) return;

  const userMessage = { text: userInput.value, id: Date.now(), sender: 'user' };
  messages.value.push(userMessage);

  // Clear input
  userInput.value = '';

  try {
    const response = await axios.post('https://your-backend-api.com/ai-chat', { prompt: userMessage.text });
    const aiMessage = { text: response.data.reply, id: Date.now(), sender: 'ai' };
    messages.value.push(aiMessage);
  } catch (error) {
    messages.value.push({ text: "There was an error fetching the AI response.", id: Date.now(), sender: 'error' });
  }
}


const goToAIChatPage = () => {
  router.push('/AiChatPage'); // or use { path: '/ai-chat' }
}

const goToEntries = () => {
    router.push('/entries');
  };

</script>
