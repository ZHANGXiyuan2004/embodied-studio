'use client';

import { useEffect, useRef, useState } from 'react';
import { Crosshair, Play } from 'lucide-react';
import { base } from '@/lib/studio';
import { useStudioReducedMotion } from './shell';
import { attachArm } from './arm/controller';
import { stage } from './arm/drawing';

export function ArmScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  const controller = useRef<ReturnType<typeof attachArm>>(undefined);
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const reduced = useStudioReducedMotion();
  useEffect(() => {
    if (!ref.current) return;
    controller.current = attachArm(ref.current, reduced, (busy) => {
      setRunning(busy);
      setAnnouncement(busy ? '机械臂开始抓放。' : '方块已移到另一处放置点。');
    });
    setReady(!!controller.current);
    setRunning(false);
    return () => controller.current?.destroy();
  }, [reduced]);

  return (
    <figure className="arm-scene">
      <figcaption className="scene-heading">
        <Crosshair size={14} aria-hidden="true" />
        机械臂抓放实验
      </figcaption>
      <div className="scene-display">
        <img
          className="scene-poster"
          src={base + '/arm-rest.webp'}
          alt="机械臂悬停在橙色方块上方"
          hidden={ready}
          width={stage.width}
          height={stage.height}
        />
        <canvas
          ref={ref}
          width={stage.width}
          height={stage.height}
          tabIndex={ready ? 0 : -1}
          role="group"
          aria-hidden={!ready}
          aria-label="交互机械臂，使用方向键移动夹爪"
          aria-describedby="arm-help"
        />
      </div>
      <div className="scene-controls" hidden={!ready}>
        <span id="arm-help">
          <span className="pointer-tip">
            {reduced ? '点击或轻触定位' : '移动指针或轻触定位'}
          </span>
          <span className="key-tip">方向键移动夹爪</span>
        </span>
        <button
          type="button"
          className="scene-play"
          aria-disabled={running}
          onClick={() => controller.current?.demo()}
        >
          <Play size={12} aria-hidden="true" />
          {running ? '抓放中…' : '演示抓放'}
        </button>
      </div>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </figure>
  );
}
