import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
}

export function useTypewriter({ text, speed = 60, delay = 0, onComplete }: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);

  const reset = useCallback(() => {
    setDisplayedText('');
    setIsComplete(false);
    setStarted(false);
  }, []);

  useEffect(() => {
    reset();
    const delayTimer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(delayTimer);
  }, [text, delay, reset]);

  useEffect(() => {
    if (!started) return;
    if (displayedText.length >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayedText, text, speed, onComplete]);

  return { displayedText, isComplete };
}
