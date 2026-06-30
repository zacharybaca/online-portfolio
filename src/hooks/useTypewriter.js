import { useState, useEffect } from 'react';

/**
 * Cycles through an array of strings with a typewriter effect.
 * @param {string[]} phrases - Array of phrases to cycle through
 * @param {number} typeSpeed - ms per character when typing (default 80)
 * @param {number} deleteSpeed - ms per character when deleting (default 40)
 * @param {number} pauseAfterType - ms to pause after fully typing a phrase (default 2000)
 * @param {number} pauseAfterDelete - ms to pause after deleting a phrase (default 500)
 */
const useTypewriter = (phrases, typeSpeed = 80, deleteSpeed = 40, pauseAfterType = 2000, pauseAfterDelete = 500) => {
  const [displayed, setDisplayed] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const current = phrases[phraseIndex];

    let delay;

    if (!isDeleting && charIndex < current.length) {
      // Still typing
      delay = typeSpeed;
      const timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex === current.length) {
      // Pause before deleting
      delay = pauseAfterType;
      const timeout = setTimeout(() => setIsDeleting(true), delay);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex > 0) {
      // Deleting
      delay = deleteSpeed;
      const timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, delay);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIndex === 0) {
      // Pause before next phrase
      delay = pauseAfterDelete;
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, isDeleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  return displayed;
};

export default useTypewriter;
