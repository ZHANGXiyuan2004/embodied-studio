'use client';
import { useState } from 'react';
import { Plot, grid, line, label } from './plot';

type Point = [number, number];
const stages = ['前往货架', '对位取箱', '搬运至工位', '放下并验收'];
const descriptions = [
  '空载机器人从起点驶向货架。',
  '底盘停靠，夹爪取下目标箱体。',
  '机器人携箱沿规划路线前往目标。',
  '箱体放在目标工位，机器人完成本轮取送。',
];

export function TransferView({
  stage = 2,
  station = 0,
}: {
  stage?: number;
  station?: number;
}) {
  return (
    <Plot
      label={stages[stage] + '，目标工位 ' + (station ? 'B' : 'A')}
      draw={(c) => {
        grid(c, '#e9edf1', '#bec7cd');
        function iso(x: number, y: number, z = 0): Point {
          return [210 + (x - y) * 17, 50 + (x + y) * 8.2 - z];
        }
        function face(points: Point[], fill: string, stroke: string) {
          c.beginPath();
          points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
          c.closePath();
          c.fillStyle = fill;
          c.fill();
          c.strokeStyle = stroke;
          c.lineWidth = 0.9;
          c.stroke();
        }
        function box(
          x: number,
          y: number,
          w: number,
          d: number,
          h: number,
          colors: string[],
          z = 0,
        ) {
          const a = iso(x, y, z + h),
            b = iso(x + w, y, z + h),
            e = iso(x, y + d, z + h),
            f = iso(x + w, y + d, z + h);
          face(
            [e, f, iso(x + w, y + d, z), iso(x, y + d, z)],
            colors[1],
            colors[3],
          );
          face(
            [b, f, iso(x + w, y + d, z), iso(x + w, y, z)],
            colors[2],
            colors[3],
          );
          face([a, b, f, e], colors[0], colors[3]);
        }
        const floor = ['#eef1f3', '#c9d1d6', '#afbdc8', '#8594a1'];
        const metal = ['#dde5ec', '#a5b4c3', '#8d9eaf', '#657686'];
        const blue = ['#698aca', '#4165a5', '#294e90', '#314e7c'];
        const orange = ['#fab890', '#de875d', '#bd6c49', '#9c5e43'];
        box(-3, 0, 12, 9, 4, floor);
        for (let x = -2; x < 9; x++)
          line(c, [iso(x, 0), iso(x, 9)], '#cbd2d7', 0.6);
        for (let y = 1; y < 9; y++)
          line(c, [iso(-3, y), iso(9, y)], '#cbd2d7', 0.6);
        box(-2, 0.5, 3, 1.5, 29, metal);
        if (stage === 0) box(-1.7, 0.7, 0.8, 0.8, 9, orange, 29);
        box(6, 0.6, 2, 1.4, 12, metal);
        box(6, 5.8, 2, 1.4, 12, metal);
        const targetY = station ? 6.5 : 2.7;
        const route = [
          iso(-1, 7),
          iso(-1, 3),
          iso(4, 3),
          iso(4, targetY),
          iso(6.5, targetY),
        ];
        c.setLineDash([4, 3]);
        line(c, route, '#507cbe', 2);
        c.setLineDash([]);
        const positions = [
          [-1, 7],
          [-1, 3],
          [3, 3],
          [6.5, targetY],
        ];
        const [x, y] = positions[stage];
        box(x - 0.7, y - 0.6, 1.4, 1.2, 8, blue);
        if (stage === 1 || stage === 2)
          box(x - 0.38, y - 0.35, 0.76, 0.7, 8, orange, 8);
        if (stage === 3) box(6.4, station ? 6.1 : 1, 0.8, 0.7, 8, orange, 12);
        label(c, 'RACK', 149, 31, '#556777');
        label(c, station ? 'STATION B' : 'STATION A', 313, 150, '#556777');
      }}
    />
  );
}
export function TransferDemo() {
  const [stage, setStage] = useState(0),
    [station, setStation] = useState(0);
  return (
    <div className="instrument">
      <TransferView stage={stage} station={station} />
      <div className="controls">
        <label>
          目标工位{' '}
          <select
            value={station}
            onChange={(e) => {
              setStation(+e.target.value);
              setStage(0);
            }}
          >
            <option value={0}>工位 A</option>
            <option value={1}>工位 B</option>
          </select>
        </label>
        <button
          className="solid small"
          onClick={() => setStage((stage + 1) % 4)}
        >
          {stage === 3 ? '重新开始' : '下一步'} →
        </button>
        <p className="result" aria-live="polite">
          <strong>
            {stage + 1} / 4 · {stages[stage]}
          </strong>
          　{descriptions[stage]}
        </p>
      </div>
    </div>
  );
}
