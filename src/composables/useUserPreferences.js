import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'src/firebase/firebase';

const DEFAULT_PROFILE = {
  displayName: '',
  bio: '',
  profileImage: 'https://bootdey.com/img/Content/avatar/avatar3.png',
  emailNotifications: false,
};

const DEFAULT_PREFERENCES = {
  themeColor: 'light',
  fontSize: 'medium',
  fontStyle: 'Arial',
  journalView: 'list',
};

const FONT_SIZES = {
  small: '14px',
  medium: '16px',
  large: '18px',
};

const THEME_MAP = {
  light: {
    background: '#fff8fb',
    text: '#2f1c27',
    accent: '#d85b93',
    gradientStart: '#fffaf8',
    gradientMid: '#fff3ee',
    gradientEnd: '#fff8fb',
  },
  darkPink: {
    background: '#170d16',
    text: '#ffe8f5',
    accent: '#ff4f9a',
    gradientStart: '#2a1121',
    gradientMid: '#1d0e1a',
    gradientEnd: '#120a12',
  },
  pastel: {
    background: '#f9f1e7',
    text: '#3d2b1f',
    accent: '#7c9a92',
    gradientStart: '#fff9f0',
    gradientMid: '#f9f1e7',
    gradientEnd: '#f2e7d8',
  },
};

function normalizeUserSettings(data = {}) {
  const normalizedThemeColor = data.themeColor === 'dark' ? 'darkPink' : data.themeColor;

  return {
    ...DEFAULT_PROFILE,
    ...DEFAULT_PREFERENCES,
    ...data,
    themeColor: normalizedThemeColor || DEFAULT_PREFERENCES.themeColor,
  };
}

function applyUserPreferences(preferences = DEFAULT_PREFERENCES) {
  const normalizedPreferences = normalizeUserSettings(preferences);
  const theme = THEME_MAP[normalizedPreferences.themeColor] || THEME_MAP.light;
  const root = document.documentElement;

  root.style.setProperty('--primary-bg', theme.background);
  root.style.setProperty('--primary-text', theme.text);
  root.style.setProperty('--accent-color', theme.accent);
  root.style.setProperty('--page-gradient-start', theme.gradientStart);
  root.style.setProperty('--page-gradient-mid', theme.gradientMid);
  root.style.setProperty('--page-gradient-end', theme.gradientEnd);
  root.style.setProperty('--font-size', FONT_SIZES[normalizedPreferences.fontSize] || FONT_SIZES.medium);
  root.style.setProperty('--font-family', normalizedPreferences.fontStyle || DEFAULT_PREFERENCES.fontStyle);
  root.setAttribute('data-journal-view', normalizedPreferences.journalView || DEFAULT_PREFERENCES.journalView);
  root.setAttribute('data-theme-color', normalizedPreferences.themeColor || DEFAULT_PREFERENCES.themeColor);
}

async function getUserSettings(userId) {
  if (!userId) {
    return normalizeUserSettings();
  }

  const snapshot = await getDoc(doc(db, 'users', userId));
  return snapshot.exists() ? normalizeUserSettings(snapshot.data()) : normalizeUserSettings();
}

async function saveUserSettings(userId, payload) {
  if (!userId) {
    throw new Error('User not authenticated');
  }

  await setDoc(doc(db, 'users', userId), payload, { merge: true });
  return getUserSettings(userId);
}

export {
  DEFAULT_PREFERENCES,
  DEFAULT_PROFILE,
  applyUserPreferences,
  getUserSettings,
  normalizeUserSettings,
  saveUserSettings,
};