'use client';

import { useState, type ComponentProps } from 'react';
import { AnimateIcon } from './animate-ui/icons/icon';
import { useStudioReducedMotion } from '@/lib/use-reduced-motion';

// Let the whole link trigger the registry icon, including when reached by Tab.
export function ActionLink(props: ComponentProps<'a'>) {
  const reduced = useStudioReducedMotion();
  const [focused, setFocused] = useState(false);
  return (
    <AnimateIcon
      asChild
      animateOnHover={!reduced}
      animate={!reduced && focused}
    >
      <a
        {...props}
        onFocus={(event) => {
          setFocused(event.currentTarget.matches(':focus-visible'));
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
      />
    </AnimateIcon>
  );
}
