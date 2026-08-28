function buildLocalReply(prompt) {
  const normalizedPrompt = prompt.toLowerCase();

  if (normalizedPrompt.includes('stuck') || normalizedPrompt.includes('overwhelmed')) {
    return 'Try writing three short lines: what happened, what made it hard, and what you need next.';
  }

  if (normalizedPrompt.includes('happy') || normalizedPrompt.includes('grateful')) {
    return 'Capture the moment, why it mattered, and one detail you do not want to forget.';
  }

  if (normalizedPrompt.includes('goal') || normalizedPrompt.includes('plan')) {
    return 'Break it into: the goal, the smallest next step, and what might get in the way.';
  }

  return 'Start with the facts, then add how you felt, and end with what you learned or want to do next.';
}

export {
  buildLocalReply,
};