'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './animate-ui/primitives/buttons/button';
import { LoaderCircle } from './animate-ui/icons/loader-circle';
import { Play } from './animate-ui/icons/play';
import { base } from '@/lib/studio';
import { motionQuery, useStudioReducedMotion } from '@/lib/use-reduced-motion';
import type { ArmPhase, attachArm } from './arm/controller';

const feedback: Record<ArmPhase, string> = {
  ready: '点击橙色方块抓取。',
  picking: '夹爪正在抓取方块…',
  holding: '已抓取。移动鼠标预览落点，再点台面放置。',
  placing: '正在放置方块…',
  demo: '正在演示抓取和放置…',
  complete: '方块已放置。',
};

export function ArmScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  const controller = useRef<Awaited<ReturnType<typeof attachArm>>>(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<ArmPhase>('ready');
  const [failed, setFailed] = useState(false);
  const reduced = useStudioReducedMotion();
  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current,
      abort = new AbortController();
    async function load() {
      try {
        const [{ attachArm }, model] = await Promise.all([
          import('./arm/controller'),
          fetch(base + '/franka-panda.glb', { signal: abort.signal }).then(
            (r) => {
              if (!r.ok) throw Error('Model could not be loaded');
              return r.arrayBuffer();
            },
          ),
        ]);
        if (abort.signal.aborted) return;
        const arm = await attachArm(
          canvas,
          model,
          matchMedia(motionQuery).matches,
          setPhase,
        );
        if (abort.signal.aborted) {
          arm.destroy();
          return;
        }
        controller.current = arm;
        setReady(true);
      } catch {
        if (!abort.signal.aborted) setFailed(true);
      }
    }
    void load();
    return () => {
      abort.abort();
      controller.current?.destroy();
      controller.current = null;
    };
  }, []);
  useEffect(() => controller.current?.setReducedMotion(reduced), [reduced]);
  const canPick = phase === 'ready' || phase === 'complete';
  return (
    <figure className="arm-scene">
      <div
        className="scene-display"
        data-phase={phase}
        style={{ aspectRatio: '1.56' }}
      >
        <img
          className="scene-poster"
          src={base + '/franka-panda.webp'}
          alt="Franka Panda 七轴机械臂、双指夹爪与台面上的橙色方块"
          hidden={ready}
          fetchPriority="high"
          width={1894}
          height={1214}
        />
        <canvas
          ref={ref}
          tabIndex={ready ? 0 : -1}
          role="group"
          aria-hidden={!ready}
          aria-label="Franka 抓放工作台"
          aria-describedby="arm-help arm-keys"
        />
        {ready && canPick && (
          <button
            className="cube-target"
            type="button"
            aria-label="抓取橙色方块"
            onClick={(event) => {
              if (!event.detail) ref.current?.focus({ preventScroll: true });
              controller.current?.pick();
            }}
          />
        )}
      </div>
      <figcaption className="sr-only">
        <span id="arm-help" role="status" aria-atomic="true">
          {ready
            ? feedback[phase]
            : failed
              ? '当前浏览器无法加载三维演示。'
              : ''}
        </span>
        <span id="arm-keys">按回车抓取，方向键选择落点，再按回车放置。</span>
      </figcaption>
      {ready && (
        <Button
          type="button"
          className="scene-play"
          aria-label="播放抓放演示"
          hoverScale={1}
          tapScale={reduced || !canPick ? 1 : 0.95}
          aria-disabled={!canPick}
          onClick={() => controller.current?.demo()}
        >
          {phase === 'demo' ? (
            <LoaderCircle animate={!reduced} size={19} aria-hidden="true" />
          ) : (
            <Play size={19} aria-hidden="true" />
          )}
        </Button>
      )}
    </figure>
  );
}
