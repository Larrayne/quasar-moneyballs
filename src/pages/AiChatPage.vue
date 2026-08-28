<template>
  <q-page class="container q-pa-md">
    <h1 class="text-h5">AI Companion</h1>
    <q-card class="q-pa-md chat-card">
      <q-banner rounded class="bg-grey-2 text-grey-8 q-mb-md">
        This assistant currently runs in local fallback mode. It can help with journaling prompts and reflection, but it is not connected to a live AI backend yet.
      </q-banner>

      <q-list class="chat-list">
        <q-item v-for="message in messages" :key="message.id" :class="`message-row message-row--${message.sender}`">
          <q-item-section>
            <div :class="`message-bubble message-bubble--${message.sender}`">{{ message.text }}</div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-input
        v-model="userInput"
        autogrow
        filled
        class="q-mt-md"
        placeholder="Type your message..."
        @keyup.enter.exact.prevent="sendMessage"
      />

      <q-btn label="Send" @click="sendMessage" color="accent" class="q-mt-md" />
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
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { buildLocalReply } from 'src/utils/aiChatReply';

const userInput = ref('');
const messages = ref([
  {
    id: 1,
    sender: 'ai',
    text: 'Tell me what happened today, and I will help you turn it into a journal entry.'
  }
]);

const $q = useQuasar();
const router = useRouter();

async function sendMessage() {
  if (!userInput.value.trim()) {
    $q.notify({ color: 'warning', message: 'Type a message before sending.', position: 'top' });
    return;
  }

  const prompt = userInput.value.trim();
  const userMessage = { text: prompt, id: Date.now(), sender: 'user' };
  messages.value.push(userMessage);
  userInput.value = '';

  const aiMessage = {
    text: buildLocalReply(prompt),
    id: Date.now() + 1,
    sender: 'ai'
  };
  messages.value.push(aiMessage);
}

const goToEntries = () => {
  router.push('/entries');
};

</script>

<style scoped>
.chat-card {
  max-width: 720px;
  margin: 0 auto;
}

.chat-list {
  min-height: 260px;
}

.message-row--user {
  justify-content: flex-end;
}

.message-bubble {
  display: inline-block;
  max-width: 90%;
  padding: 12px 14px;
  border-radius: 16px;
}

.message-bubble--user {
  background: #f8d8e6;
}

.message-bubble--ai {
  background: #f2f2f2;
}
</style>
