'use client';
import { useState } from 'react';
import { Plot, grid, line, label } from './plot';
export function ContactView({
  mu = 0.5,
  force = 8,
}: {
  mu?: number;
  force?: number;
}) {
  return (
    <Plot
      label={
        '触觉概念曲线，施力上限 ' +
        force +
        ' N，静摩擦阈值 ' +
        (mu * 10).toFixed(1) +
        ' N'
      }
      draw={(c) => {
        grid(c, '#eee7df', '#d8cdc0');
        const x0 = 43,
          x1 = 411,
          y0 = 171,
          y = (f: number) => y0 - f * 10.7,
          limit = mu * 10;
        line(
          c,
          [
            [x0, 29],
            [x0, y0],
            [x1, y0],
          ],
          '#978979',
        );
        for (const v of [0, 5, 10]) {
          line(
            c,
            [
              [x0, y(v)],
              [x1, y(v)],
            ],
            '#d6cabc',
            0.8,
          );
          label(c, String(v), 21, y(v) + 3, '#706354');
        }
        c.setLineDash([4, 4]);
        line(
          c,
          [
            [x0, y(limit)],
            [x1, y(limit)],
          ],
          '#a8876c',
        );
        c.setLineDash([]);
        const applied: number[][] = [],
          friction: number[][] = [];
        for (let i = 0; i <= 180; i++) {
          const f = (force * i) / 180,
            x = x0 + ((x1 - x0) * i) / 180;
          applied.push([x, y(f)]);
          friction.push([x, y(f > limit ? 0.75 * limit : f)]);
        }
        line(c, applied, '#a69787', 2);
        line(c, friction, '#a15534', 3);
        if (force > limit) {
          const x = x0 + ((x1 - x0) * limit) / force;
          c.beginPath();
          c.arc(x, y(limit), 4, 0, Math.PI * 2);
          c.fillStyle = '#924a31';
          c.fill();
        }
        label(c, 'FORCE / N', 54, 40, '#796656');
        label(c, 'TIME →', x1 - 45, 192, '#796656');
      }}
    />
  );
}
export function ContactDemo() {
  const [mu, setMu] = useState(0.5),
    [force, setForce] = useState(8);
  return (
    <div className="instrument">
      <ContactView mu={mu} force={force} />
      <div className="controls">
        <label>
          静摩擦系数 {mu.toFixed(2)}{' '}
          <input
            type="range"
            min=".2"
            max=".9"
            step=".05"
            value={mu}
            onChange={(e) => setMu(+e.target.value)}
          />
        </label>
        <label>
          峰值推力 {force} N{' '}
          <input
            type="range"
            min="1"
            max="12"
            value={force}
            onChange={(e) => setForce(+e.target.value)}
          />
        </label>
        <p className="result" aria-live="polite">
          <strong>{force > mu * 10 ? '出现滑移' : '保持静止'}</strong>
          　法向力固定为 10 N，静摩擦阈值为 {(mu * 10).toFixed(1)}{' '}
          N。灰线为施加推力，棕线为摩擦力大小。模型设动摩擦系数为静摩擦系数的
          75%。
        </p>
      </div>
    </div>
  );
}
