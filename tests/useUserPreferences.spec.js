import { beforeEach, describe, expect, it, vi } from 'vitest';

const getDocMock = vi.fn();
const setDocMock = vi.fn();
const docMock = vi.fn((database, collectionName, userId) => ({ database, collectionName, userId }));

vi.mock('firebase/firestore', () => ({
  doc: docMock,
  getDoc: getDocMock,
  setDoc: setDocMock,
}));

vi.mock('src/firebase/firebase', () => ({
  db: { mocked: true },
}));

const preferencesModule = await import('src/composables/useUserPreferences');

const {
  applyUserPreferences,
  DEFAULT_PREFERENCES,
  DEFAULT_PROFILE,
  getUserSettings,
  normalizeUserSettings,
  saveUserSettings,
} = preferencesModule;

describe('useUserPreferences', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-journal-view');
    document.documentElement.removeAttribute('data-theme-color');
    document.documentElement.style.cssText = '';
    getDocMock.mockReset();
    setDocMock.mockReset();
    docMock.mockClear();
  });

  it('fills missing settings with defaults', () => {
    expect(normalizeUserSettings({ displayName: 'Lolo' })).toEqual({
      ...DEFAULT_PROFILE,
      ...DEFAULT_PREFERENCES,
      displayName: 'Lolo',
    });
  });

  it('applies CSS variables and attributes to the document root', () => {
    applyUserPreferences({ themeColor: 'dark', fontSize: 'large', fontStyle: 'Courier New', journalView: 'grid' });

    expect(document.documentElement.style.getPropertyValue('--primary-bg')).toBe('#24141d');
    expect(document.documentElement.style.getPropertyValue('--primary-text')).toBe('#f7e9f0');
    expect(document.documentElement.style.getPropertyValue('--accent-color')).toBe('#ff8fba');
    expect(document.documentElement.style.getPropertyValue('--font-size')).toBe('18px');
    expect(document.documentElement.style.getPropertyValue('--font-family')).toBe('Courier New');
    expect(document.documentElement.getAttribute('data-journal-view')).toBe('grid');
    expect(document.documentElement.getAttribute('data-theme-color')).toBe('dark');
  });

  it('returns defaults when no user id is provided', async () => {
    await expect(getUserSettings()).resolves.toEqual({
      ...DEFAULT_PROFILE,
      ...DEFAULT_PREFERENCES,
    });
    expect(getDocMock).not.toHaveBeenCalled();
  });

  it('merges saved Firestore settings with defaults', async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ themeColor: 'pastel', bio: 'Testing settings' }),
    });

    await expect(getUserSettings('user-123')).resolves.toEqual({
      ...DEFAULT_PROFILE,
      ...DEFAULT_PREFERENCES,
      themeColor: 'pastel',
      bio: 'Testing settings',
    });
    expect(docMock).toHaveBeenCalledWith({ mocked: true }, 'users', 'user-123');
  });

  it('saves settings and returns the merged persisted result', async () => {
    setDocMock.mockResolvedValue();
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ fontSize: 'small', displayName: 'Saved User' }),
    });

    await expect(saveUserSettings('user-123', { fontSize: 'small' })).resolves.toEqual({
      ...DEFAULT_PROFILE,
      ...DEFAULT_PREFERENCES,
      fontSize: 'small',
      displayName: 'Saved User',
    });
    expect(setDocMock).toHaveBeenCalledWith(
      { database: { mocked: true }, collectionName: 'users', userId: 'user-123' },
      { fontSize: 'small' },
      { merge: true }
    );
  });

  it('throws when saving settings without an authenticated user id', async () => {
    await expect(saveUserSettings('', { themeColor: 'dark' })).rejects.toThrow('User not authenticated');
  });
});