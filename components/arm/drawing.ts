// Orthographic workshop illustration. Coordinates use the same drawing space as the controller.
export type Point = { x: number; y: number };
export const stage = { width: 600, height: 366 };
export const rest: Point = { x: 429, y: 159 };
export const stations = [367, 453];
export const cubeFloor = 279;
export const graspOffset = 46;
const shoulder = { x: 147, y: 211 };
const humerus = 149;
const forearm = 183;
type Context = CanvasRenderingContext2D;
type Vertex = [number, number];

function polygon(
  c: Context,
  points: Vertex[],
  fill: string | CanvasGradient,
  stroke?: string,
) {
  c.beginPath();
  points.forEach(([x, y], index) =>
    index === 0 ? c.moveTo(x, y) : c.lineTo(x, y),
  );
  c.closePath();
  c.fillStyle = fill;
  c.fill();
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.stroke();
  }
}

function ellipse(
  c: Context,
  x: number,
  y: number,
  rx: number,
  ry: number,
  fill: string | CanvasGradient,
) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
}

function line(
  c: Context,
  x: number,
  y: number,
  x2: number,
  y2: number,
  color: string,
  width = 1,
) {
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x2, y2);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.stroke();
}

function workshop(c: Context) {
  c.save();
  const fog = c.createRadialGradient(335, 165, 10, 335, 165, 295);
  fog.addColorStop(0, '#3c565e88');
  fog.addColorStop(1, '#18282e00');
  c.fillStyle = fog;
  c.fillRect(0, 0, stage.width, stage.height);
  // The floor vanishes into the glass instead of ending at a hard horizon.
  const floor = c.createLinearGradient(0, 170, 0, 366);
  floor.addColorStop(0, '#a2c1bb00');
  floor.addColorStop(0.6, '#a2c1bb31');
  floor.addColorStop(1, '#a2c1bb08');
  c.strokeStyle = floor;
  c.lineWidth = 0.8;
  c.beginPath();
  for (let x = -800; x < 900; x += 40) {
    c.moveTo(x, 169);
    c.lineTo(x + 348, 366);
    c.moveTo(x, 169);
    c.lineTo(x - 348, 366);
  }
  c.stroke();
  c.strokeStyle = '#a2c1bb2c';
  c.setLineDash([3, 7]);
  c.beginPath();
  c.ellipse(270, 289, 192, 41, 0, 0, 2 * Math.PI);
  c.stroke();
  c.setLineDash([]);
  // Registration crosses and the two placement pads stay fixed as the arm moves.
  for (const [x, y] of [
    [54, 71],
    [535, 71],
    [54, 303],
    [535, 303],
  ]) {
    line(c, x - 4, y, x + 4, y, '#a7c0bd65');
    line(c, x, y - 4, x, y + 4, '#a7c0bd65');
  }
  for (const x of stations) {
    polygon(
      c,
      [
        [x - 26, 291],
        [x, 281],
        [x + 25, 291],
        [x, 301],
      ],
      '#657c7b30',
      '#9eaeaa75',
    );
  }
  c.restore();
}

function pedestal(c: Context) {
  c.save();
  c.translate(167, 302);
  c.scale(100, 20);
  const shadow = c.createRadialGradient(0, 0, 0.18, 0, 0, 1);
  shadow.addColorStop(0, '#09131ac9');
  shadow.addColorStop(1, '#09131a00');
  ellipse(c, 0, 0, 1, 1, shadow);
  c.restore();
  function collar(
    y: number,
    bottom: number,
    topRadius: number,
    bottomRadius: number,
    color: string,
    cap: string,
  ) {
    polygon(
      c,
      [
        [147 - topRadius, y],
        [147 + topRadius, y],
        [147 + bottomRadius, bottom],
        [147 - bottomRadius, bottom],
      ],
      color,
    );
    ellipse(c, 147, bottom, bottomRadius, bottomRadius * 0.24, color);
    ellipse(c, 147, y, topRadius, topRadius * 0.24, cap);
  }
  collar(289, 298, 64, 64, '#303f43', '#8e9e9b');
  collar(282, 289, 60, 61, '#515f5f', '#b9c2b9');
  collar(254, 281, 37, 54, '#84948f', '#d1d4c7');
  polygon(
    c,
    [
      [110, 255],
      [119, 259],
      [119, 286],
      [98, 279],
    ],
    '#aab7aa',
  );
  collar(250, 255, 37, 37, '#39484b', '#677a78');
  collar(227, 247, 30, 35, '#85938e', '#d3d9ca');
  for (const [x, y] of [
    [101, 289],
    [185, 292],
    [117, 280],
    [192, 281],
  ]) {
    ellipse(c, x, y, 3, 1.3, '#26383b');
  }
}

function bolt(c: Context, x: number, y: number, radius = 2.3) {
  ellipse(c, x, y, radius, radius, '#293c3f');
  line(
    c,
    x - radius * 0.5,
    y + radius * 0.3,
    x + radius * 0.5,
    y - radius * 0.3,
    '#a6b6af',
    0.8,
  );
}

function joint(c: Context, p: Point, r: number, accent = false) {
  const { x, y } = p;
  ellipse(c, x + 5, y - 4, r + 2, r + 2, '#546666');
  ellipse(c, x, y, r + 2, r + 2, '#1a292d');
  ellipse(c, x, y, r, r, accent ? '#c67c51' : '#98a7a0');
  ellipse(c, x, y, r - 3, r - 3, accent ? '#e39b6d' : '#c4cdc0');
  ellipse(c, x, y, r * 0.62, r * 0.62, '#3b4b4b');
  ellipse(c, x - 1, y - 1, r * 0.37, r * 0.37, '#6d7d79');
  bolt(c, x - 1, y - 1, r * 0.13);
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    bolt(c, x + Math.cos(angle) * r * 0.8, y + Math.sin(angle) * r * 0.8, 1.55);
  }
}

function link(
  c: Context,
  start: Point,
  end: Point,
  wide: number,
  narrow: number,
) {
  const length = Math.hypot(end.x - start.x, end.y - start.y);
  c.save();
  c.translate(start.x, start.y);
  c.rotate(Math.atan2(end.y - start.y, end.x - start.x));
  const points: Vertex[] = [
    [0, -wide],
    [21, -wide - 2],
    [length - 26, -narrow - 2],
    [length, -narrow],
    [length + 2, narrow - 1],
    [length - 21, narrow + 2],
    [27, wide + 2],
    [0, wide],
  ];
  polygon(
    c,
    points.map(([x, y]) => [x + 5, y - 6]),
    '#84948e',
  );
  const alloy = c.createLinearGradient(0, -wide, 12, wide);
  alloy.addColorStop(0, '#e6e6d3');
  alloy.addColorStop(0.5, '#c1cabc');
  alloy.addColorStop(1, '#96a59c');
  polygon(c, points, alloy, '#485956');
  polygon(
    c,
    [
      [18, -wide + 2],
      [length - 22, -narrow + 1],
      [length - 29, -narrow + 5],
      [31, -wide + 7],
    ],
    '#f5f1dcbf',
  );
  polygon(
    c,
    [
      [29, wide - 7],
      [length - 26, narrow - 4],
      [length - 30, narrow],
      [33, wide - 1],
    ],
    '#73847e',
  );
  polygon(
    c,
    [
      [32, -3],
      [length - 34, -3],
      [length - 44, 4],
      [41, 5],
    ],
    '#a0ada3',
  );
  for (let i = 0; i < 3; i++)
    line(c, 36 + i * 5, wide - 10, 38 + i * 5, wide - 14, '#536560', 1.4);
  bolt(c, 25, -wide + 8);
  bolt(c, length - 23, narrow - 6);
  c.restore();
}

function cube(c: Context, p: Point) {
  const { x, y } = p;
  polygon(
    c,
    [
      [x - 13, y - 8],
      [x, y - 14],
      [x + 13, y - 8],
      [x, y - 2],
    ],
    '#ffc394',
  );
  polygon(
    c,
    [
      [x - 13, y - 8],
      [x, y - 2],
      [x, y + 12],
      [x - 13, y + 5],
    ],
    '#dc8b5e',
  );
  polygon(
    c,
    [
      [x, y - 2],
      [x + 13, y - 8],
      [x + 13, y + 5],
      [x, y + 12],
    ],
    '#b46b47',
  );
}

export function drawArm(c: Context, wrist: Point, part: Point, grip: number) {
  c.clearRect(0, 0, stage.width, stage.height);
  workshop(c);
  pedestal(c);
  // Pick the raised-elbow solution of the two-link inverse kinematics.
  const dx = wrist.x - shoulder.x,
    dy = wrist.y - shoulder.y;
  const distance = Math.hypot(dx, dy);
  const angle =
    Math.atan2(dy, dx) -
    Math.acos(
      Math.max(
        -1,
        Math.min(
          1,
          (humerus * humerus + distance * distance - forearm * forearm) /
            (2 * humerus * distance),
        ),
      ),
    );
  const elbow = {
    x: shoulder.x + humerus * Math.cos(angle),
    y: shoulder.y + humerus * Math.sin(angle),
  };
  // Flexible black loom just outside the shoulder and upper link.
  c.beginPath();
  c.moveTo(117, 241);
  c.bezierCurveTo(
    90,
    188,
    elbow.x - 42,
    elbow.y - 22,
    elbow.x + 8,
    elbow.y - 17,
  );
  c.strokeStyle = '#16262a';
  c.lineWidth = 9;
  c.stroke();
  c.strokeStyle = '#768783';
  c.lineWidth = 2;
  c.stroke();
  link(c, shoulder, elbow, 22, 18);
  joint(c, shoulder, 29, true);
  link(c, elbow, wrist, 18, 11);
  joint(c, elbow, 23);
  const { x, y } = wrist;
  polygon(
    c,
    [
      [x - 7, y],
      [x + 10, y - 2],
      [x + 10, y + 19],
      [x - 7, y + 19],
    ],
    '#75847f',
  );
  polygon(
    c,
    [
      [x - 12, y + 14],
      [x + 13, y + 14],
      [x + 13, y + 25],
      [x - 12, y + 25],
    ],
    '#c8d0c3',
  );
  polygon(
    c,
    [
      [x - 12, y + 22],
      [x + 13, y + 22],
      [x + 13, y + 26],
      [x - 12, y + 26],
    ],
    '#62716d',
  );
  joint(c, wrist, 13, true);
  cube(c, part);
  const gap = 20 - 7 * grip;
  for (const sign of [-1, 1]) {
    const side = (offset: number) => x + sign * offset;
    polygon(
      c,
      [
        [side(5), y + 26],
        [side(12), y + 25],
        [side(gap + 2), y + 34],
        [side(gap + 1), y + 48],
        [side(gap - 3), y + 50],
        [side(gap - 3), y + 36],
      ],
      '#aebbb1',
      '#586c69',
    );
    line(c, side(gap - 3), y + 40, side(gap - 3), y + 48, '#23373a', 2);
  }
}
