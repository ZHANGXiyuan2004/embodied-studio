'use client';
import { useState } from 'react';
import { Plot, grid, line, label } from './plot';
const run = 120,
  chunks = 4;
export function TimingView({
  delay = 70,
  asyncMode = true,
}: {
  delay?: number;
  asyncMode?: boolean;
}) {
  return (
    <Plot
      label={'四段动作的' + (asyncMode ? '异步' : '同步') + '推理与执行时间线'}
      draw={(c) => {
        grid(c, '#e9ece6', '#cdd3c8');
        const start = 64,
          end = 412,
          scale = (end - start) / (chunks * (delay + run));
        label(c, 'INFERENCE', 24, 55, '#546255', 10);
        label(c, 'ACTION', 24, 122, '#546255', 10);
        for (let i = 0; i <= 8; i++) {
          const x = start + ((end - start) * i) / 8;
          line(
            c,
            [
              [x, 65],
              [x, 161],
            ],
            '#c5cec1',
            0.7,
          );
        }
        for (let i = 0; i < chunks; i++) {
          const t = asyncMode ? i * Math.max(delay, run) : i * (delay + run);
          c.fillStyle = '#4c6453';
          c.fillRect(start + t * scale, 70, delay * scale - 1, 26);
          c.fillStyle = '#9dae92';
          c.fillRect(start + (t + delay) * scale, 131, run * scale - 1, 26);
          label(
            c,
            String(i + 1).padStart(2, '0'),
            start + t * scale + 4,
            87,
            '#fff',
            9,
          );
          line(
            c,
            [
              [start + (t + delay) * scale, 96],
              [start + (t + delay) * scale, 130],
            ],
            '#84907c',
            1,
          );
        }
        line(
          c,
          [
            [start, 176],
            [end, 176],
          ],
          '#8b9787',
        );
        label(c, '0 ms', start, 193, '#606b5b');
        label(c, chunks * (delay + run) + ' ms', end - 47, 193, '#606b5b');
      }}
    />
  );
}
export function TimingDemo() {
  const [delay, setDelay] = useState(70),
    [mode, setMode] = useState(true);
  const total = mode
    ? delay + run + (chunks - 1) * Math.max(delay, run)
    : chunks * (delay + run);
  return (
    <div className="instrument">
      <TimingView delay={delay} asyncMode={mode} />
      <div className="controls">
        <label>
          调度方式{' '}
          <select
            value={mode ? 'async' : 'sync'}
            onChange={(e) => setMode(e.target.value === 'async')}
          >
            <option value="async">异步</option>
            <option value="sync">同步</option>
          </select>
        </label>
        <label>
          每段推理 {delay} ms{' '}
          <input
            type="range"
            min="25"
            max="180"
            step="5"
            value={delay}
            onChange={(e) => setDelay(+e.target.value)}
          />
        </label>
        <p className="result" aria-live="polite">
          <strong>总时长 {total} ms</strong>　四段动作各执行 120
          ms，执行器共等待 {total - chunks * run} ms（含首次推理）。
        </p>
      </div>
    </div>
  );
}
