import { describe, expect, it } from 'vitest';
import { buildLocalReply } from 'src/utils/aiChatReply';

describe('buildLocalReply', () => {
  it('returns the support prompt for stuck feelings', () => {
    expect(buildLocalReply('I feel stuck and overwhelmed today')).toBe(
      'Try writing three short lines: what happened, what made it hard, and what you need next.'
    );
  });

  it('returns the gratitude prompt for positive moods', () => {
    expect(buildLocalReply('I feel grateful for what happened')).toBe(
      'Capture the moment, why it mattered, and one detail you do not want to forget.'
    );
  });

  it('falls back to the default journaling guidance', () => {
    expect(buildLocalReply('I need to write about my afternoon')).toBe(
      'Start with the facts, then add how you felt, and end with what you learned or want to do next.'
    );
  });
});