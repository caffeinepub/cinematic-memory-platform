import { useEffect, useCallback } from 'react';

export default function RippleEffect() {
  const createRipple = useCallback((e: MouseEvent) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-circle';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => {
      if (document.body.contains(ripple)) {
        document.body.removeChild(ripple);
      }
    }, 700);
  }, []);

  useEffect(() => {
    document.addEventListener('click', createRipple);
    return () => document.removeEventListener('click', createRipple);
  }, [createRipple]);

  return null;
}
