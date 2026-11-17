'use client';

import { useSyncExternalStore } from 'react';

export const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeToMotion(notify: () => void) {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener('change', notify);
  return () => preference.removeEventListener('change', notify);
}
export function useStudioReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}
