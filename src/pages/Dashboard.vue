<template>
  <q-page class="dashboard-page">
    <section class="hero-panel">
      <div class="hero-copy">
        <div class="hero-kicker">Reflect with intention</div>
        <h1 class="hero-title">{{ headline }}</h1>
        <p class="hero-description">{{ description }}</p>

        <div class="hero-actions">
          <q-btn
            v-if="isAuthenticated"
            label="Open Entries"
            @click="$router.push('/entries')"
            color="primary"
            unelevated
            class="hero-btn"
          />

          <q-btn
            v-if="isAuthenticated"
            label="Open Settings"
            @click="$router.push('/settings')"
            color="secondary"
            outline
            class="hero-btn"
          />

          <q-btn
            v-if="!isAuthenticated"
            label="Login"
            @click="$router.push('/login')"
            color="primary"
            unelevated
            class="hero-btn"
          />

          <q-btn
            v-if="!isAuthenticated"
            label="Create Account"
            @click="$router.push('/register')"
            color="secondary"
            outline
            class="hero-btn"
          />
        </div>
      </div>

      <div class="hero-aside">
        <div class="quote-card shadow-1">
          <div class="quote-label">Today’s prompt</div>
          <p class="quote-text">What moment from today deserves a few honest lines before it disappears?</p>
        </div>
      </div>
    </section>

    <section class="feature-grid">
      <article class="feature-card shadow-1">
        <div class="feature-number">01</div>
        <h2 class="feature-title">Capture entries quickly</h2>
        <p class="feature-body">Write short reflections, store them by account, and keep your journal separate from every other user.</p>
      </article>

      <article class="feature-card shadow-1">
        <div class="feature-number">02</div>
        <h2 class="feature-title">Shape the reading experience</h2>
        <p class="feature-body">Adjust theme, font, and journal layout so the app feels more personal when you return.</p>
      </article>

      <article class="feature-card shadow-1">
        <div class="feature-number">03</div>
        <h2 class="feature-title">Use guided reflection</h2>
        <p class="feature-body">The built-in companion gives lightweight journaling prompts even before a full AI backend is added.</p>
      </article>
    </section>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';
import { user } from 'src/firebase/firebase';

const isAuthenticated = computed(() => !!user.value);

const headline = computed(() => {
  return isAuthenticated.value ? 'Welcome back to your journal.' : 'Happy to have you here!';
});

const description = computed(() => {
  return isAuthenticated.value
    ? 'Pick up where you left off, capture what matters, and keep your journaling space tuned to you.'
    : 'Build a private journaling habit with guided prompts, account-based entries, and a calmer writing space.';
});


</script>

<style scoped>
.dashboard-page {
  min-height: 100%;
  padding: 32px;
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.9fr);
  gap: 24px;
  align-items: stretch;
  padding: 32px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.82), transparent 38%),
    linear-gradient(135deg, #fffaf1 0%, #ffe3d1 52%, #f5d7dd 100%);
  border: 1px solid rgba(117, 78, 57, 0.12);
}

.hero-kicker {
  margin-bottom: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #8b5e46;
}

.hero-title {
  margin: 0;
  font-size: clamp(2.2rem, 5vw, 4.4rem);
  line-height: 0.95;
  font-weight: 800;
  max-width: 8ch;
  color: #2e2019;
}

.hero-description {
  max-width: 56ch;
  margin: 18px 0 0;
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(46, 32, 25, 0.82);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero-btn {
  min-width: 170px;
  border-radius: 999px;
}

.hero-aside {
  display: flex;
  align-items: flex-end;
}

.quote-card {
  width: 100%;
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 250, 245, 0.86);
  border: 1px solid rgba(139, 94, 70, 0.12);
}

.quote-label {
  margin-bottom: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c1653d;
}

.quote-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.75;
  color: #473229;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 24px;
}

.feature-card {
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(117, 78, 57, 0.1);
}

.feature-number {
  margin-bottom: 18px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #c1653d;
}

.feature-title {
  margin: 0 0 10px;
  font-size: 1.2rem;
  color: #2e2019;
}

.feature-body {
  margin: 0;
  line-height: 1.7;
  color: rgba(46, 32, 25, 0.78);
}

@media (max-width: 900px) {
  .hero-panel,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-page {
    padding: 20px;
  }

  .hero-panel {
    padding: 24px;
  }
}
</style>
