'use client';

import { useEffect, useRef, useState } from 'react';
import { wechatId } from '@/lib/studio';
import { Button } from './animate-ui/primitives/buttons/button';
import { Copy } from './animate-ui/icons/copy';
import { Check } from './animate-ui/icons/check';
import { useStudioReducedMotion } from '@/lib/use-reduced-motion';

export function ContactButton() {
  const [result, setResult] = useState<'idle' | 'copied' | 'manual'>('idle');
  const manual = useRef<HTMLInputElement>(null);
  const reset = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reduced = useStudioReducedMotion();

  useEffect(() => () => clearTimeout(reset.current), []);
  useEffect(() => {
    if (result === 'manual') {
      manual.current?.focus();
      manual.current?.select();
    }
  }, [result]);

  async function copyWeChat() {
    clearTimeout(reset.current);
    try {
      await navigator.clipboard.writeText(wechatId);
      setResult('copied');
      reset.current = setTimeout(() => setResult('idle'), 2200);
    } catch {
      setResult('manual');
      manual.current?.select();
    }
  }
  return (
    <>
      <Button
        type="button"
        className="contact-button"
        hoverScale={1}
        tapScale={reduced ? 1 : 0.97}
        aria-label="联系我们"
        onClick={copyWeChat}
      >
        {result === 'copied' ? '已复制' : '联系我们'}
        {result === 'copied' ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
      </Button>
      <span className="sr-only" role="status">
        {result === 'copied' ? '微信号已复制' : ''}
      </span>
      {result === 'manual' && (
        <label className="manual-contact">
          请手动复制微信号
          <input
            ref={manual}
            readOnly
            value={wechatId}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
      )}
      <noscript>
        <span className="manual-contact">微信号 {wechatId}</span>
      </noscript>
    </>
  );
}
