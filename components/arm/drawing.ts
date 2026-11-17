// Orthographic product illustration. The controller supplies the screen-space wrist and workpiece.
export type Point = { x: number; y: number };
export const stage = { x: 32, y: 6, width: 524, height: 322 };
export const rest: Point = { x: 389, y: 174 };
export const stations = [367, 453];
export const cubeFloor = 279;
export const graspOffset = 46;

type Context = CanvasRenderingContext2D;
type Plan = { x: number; z: number };
type Finish = {
  top: string;
  rim: string;
  wall: [string, string, string, string];
};
const ceramic: Finish = {
  top: '#f6f6ef',
  rim: '#bfc2ba',
  wall: ['#b8bdb8', '#f1f3ed', '#d3d8d2', '#a1a8a3'],
};
const graphite: Finish = {
  top: '#454a49',
  rim: '#353a39',
  wall: ['#292d2e', '#606664', '#414746', '#25292a'],
};
const titanium: Finish = {
  top: '#cdd1ca',
  rim: '#969c97',
  wall: ['#777e7a', '#e7e9e2', '#b4bab5', '#707772'],
};
const orange: Finish = {
  top: '#fa9863',
  rim: '#b85e39',
  wall: ['#c86d43', '#ffac76', '#e08453', '#ae5836'],
};
const tau = Math.PI * 2;
const tilt = 0.44;
const ground = 282;
const base = { x: 150, z: -8 };

function project(p: Plan, height: number): Point {
  return { x: p.x, y: ground + p.z * tilt - height };
}
function path(c: Context, points: Point[]) {
  c.beginPath();
  c.moveTo(points[0].x, points[0].y);
  for (const p of points.slice(1)) c.lineTo(p.x, p.y);
  c.closePath();
}
function face(c: Context, points: Point[], fill: string | CanvasGradient) {
  path(c, points);
  c.fillStyle = fill;
  c.fill();
}
function ellipse(
  c: Context,
  x: number,
  y: number,
  rx: number,
  ry: number,
  color: string | CanvasGradient,
) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, tau);
  c.fillStyle = color;
  c.fill();
}
function light(c: Context, x1: number, x2: number, colors: Finish['wall']) {
  const g = c.createLinearGradient(x1, 0, x2, 0);
  g.addColorStop(0, colors[0]);
  g.addColorStop(0.24, colors[1]);
  g.addColorStop(0.65, colors[2]);
  g.addColorStop(1, colors[3]);
  return g;
}
// Stacked turned profiles retain a continuous reflection around each bearing and spindle.
function turned(
  c: Context,
  p: Plan,
  bottom: number,
  top: number,
  foot: number,
  cap: number,
  finish: Finish,
) {
  const a = project(p, bottom),
    b = project(p, top);
  c.beginPath();
  c.moveTo(b.x - cap, b.y);
  c.ellipse(b.x, b.y, cap, cap * tilt, 0, Math.PI, tau);
  c.lineTo(a.x + foot, a.y);
  c.ellipse(a.x, a.y, foot, foot * tilt, 0, 0, Math.PI);
  c.closePath();
  c.fillStyle = light(
    c,
    p.x - Math.max(foot, cap),
    p.x + Math.max(foot, cap),
    finish.wall,
  );
  c.fill();
  ellipse(c, b.x, b.y, cap, cap * tilt, finish.top);
  c.strokeStyle = finish.rim;
  c.lineWidth = 0.55;
  c.stroke();
}
// A housing footprint follows its two bearings. The curved walls and lid share the same outline.
function outline(a: Plan, b: Plan, r1: number, r2: number): Plan[] {
  const angle = Math.atan2(b.z - a.z, b.x - a.x);
  const tangent = Math.acos((r1 - r2) / Math.hypot(b.x - a.x, b.z - a.z));
  const ring: Plan[] = [];
  function arc(p: Plan, radius: number, start: number, end: number) {
    for (let i = 0; i <= 24; i++) {
      const t = angle + start + ((end - start) * i) / 24;
      ring.push({
        x: p.x + radius * Math.cos(t),
        z: p.z + radius * Math.sin(t),
      });
    }
  }
  arc(b, r2, -tangent, tangent);
  arc(a, r1, tangent, tau - tangent);
  return ring;
}
function housing(
  c: Context,
  ring: Plan[],
  bottom: number,
  top: number,
  finish: Finish,
) {
  const lid = ring.map((p) => project(p, top)),
    floor = ring.map((p) => project(p, bottom));
  let left = 0,
    right = 0;
  for (let i = 1; i < lid.length; i++) {
    if (lid[i].x < lid[left].x) left = i;
    if (lid[i].x > lid[right].x) right = i;
  }
  // With this winding, the front silhouette runs from right to left.
  const near: number[] = [right];
  while (near[near.length - 1] !== left)
    near.push((near[near.length - 1] + 1) % lid.length);
  face(
    c,
    [
      ...near.map((i) => lid[i]),
      ...near
        .slice()
        .reverse()
        .map((i) => floor[i]),
    ],
    light(c, lid[left].x, lid[right].x, finish.wall),
  );
  c.strokeStyle = finish.rim;
  c.lineWidth = 0.65;
  c.stroke();
  const glaze = c.createLinearGradient(lid[left].x, 0, lid[right].x, 50);
  glaze.addColorStop(0, finish.top);
  glaze.addColorStop(0.63, finish.top);
  glaze.addColorStop(1, finish.wall[2]);
  face(c, lid, glaze);
  c.strokeStyle = finish.rim;
  c.lineWidth = 0.7;
  c.stroke();
}
function housingLayers(
  c: Context,
  a: Plan,
  b: Plan,
  r1: number,
  r2: number,
  h: number,
  thickness: number,
) {
  housing(c, outline(a, b, r1 - 2, r2 - 2), h, h + 3, graphite);
  housing(c, outline(a, b, r1, r2), h + 3, h + thickness - 2, ceramic);
  housing(
    c,
    outline(a, b, r1 - 1.5, r2 - 1.5),
    h + thickness - 2,
    h + thickness,
    ceramic,
  );
}
function shadow(
  c: Context,
  x: number,
  y: number,
  rx: number,
  ry: number,
  opacity: number,
) {
  c.save();
  c.translate(x, y);
  c.scale(rx, ry);
  const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, `rgba(48,49,44,${opacity})`);
  g.addColorStop(0.52, `rgba(48,49,44,${opacity * 0.37})`);
  g.addColorStop(1, 'rgba(48,49,44,0)');
  ellipse(c, 0, 0, 1, 1, g);
  c.restore();
}
function platform(c: Context) {
  // Rounded mounting plate, layer seam, and feet, all in the same ground plane.
  const plate: Plan[] = [];
  const yaw = -0.27;
  for (const [dx, dz, start] of [
    [43, 32, 0],
    [-43, 32, Math.PI / 2],
    [-43, -32, Math.PI],
    [43, -32, (3 * Math.PI) / 2],
  ]) {
    for (let i = 0; i <= 8; i++) {
      const t = start + (i * Math.PI) / 16,
        u = dx + 9 * Math.cos(t),
        v = dz + 9 * Math.sin(t);
      plate.push({
        x: base.x + u * Math.cos(yaw) - v * Math.sin(yaw),
        z: base.z + u * Math.sin(yaw) + v * Math.cos(yaw),
      });
    }
  }
  housing(c, plate, 0, 5, graphite);
  housing(c, plate, 5, 12, titanium);
  for (const [x, z] of [
    [-40, -22],
    [39, -37],
    [38, 22],
    [-37, 37],
  ]) {
    const hole = project({ x: base.x + x, z: base.z + z }, 12);
    ellipse(c, hole.x, hole.y, 2.7, 1.3, '#626762');
  }
  turned(c, base, 12, 20, 40, 40, graphite);
  turned(c, base, 20, 25, 40, 37, ceramic);
  turned(c, base, 25, 74, 37, 31, ceramic);
  const front = project(base, 43);
  c.fillStyle = '#535954';
  c.font = '600 6px ui-monospace, monospace';
  c.fillText('SCARA', front.x - 12, front.y + 11);
  turned(c, base, 74, 85, 30.8, 30.8, graphite);
  turned(c, base, 85, 89, 31, 31, titanium);
  turned(c, base, 89, 108, 29.5, 29.5, graphite);
}
// Flexible service loom from the fixed column to the moving elbow.
function loom(c: Context, elbow: Plan) {
  const end = project({ x: elbow.x - 7, z: elbow.z - 5 }, 146);
  const start = project({ x: base.x - 26, z: base.z - 4 }, 69);
  c.save();
  c.lineCap = 'round';
  c.beginPath();
  c.moveTo(start.x, start.y);
  c.bezierCurveTo(
    start.x - 45,
    start.y - 65,
    end.x - 40,
    end.y - 79,
    end.x,
    end.y,
  );
  c.strokeStyle = '#373c3b';
  c.lineWidth = 6;
  c.stroke();
  c.strokeStyle = '#747a74';
  c.lineWidth = 3.8;
  c.stroke();
  c.strokeStyle = '#464c48';
  c.lineWidth = 4.3;
  c.setLineDash([1.2, 3.7]);
  c.stroke();
  c.restore();
}

function vents(c: Context, a: Plan, b: Plan, height: number) {
  const len = Math.hypot(b.x - a.x, b.z - a.z);
  const dx = (b.x - a.x) / len,
    dz = (b.z - a.z) / len;
  const origin = project(a, height);
  c.save();
  c.transform(dx, tilt * dz, -dz, tilt * dx, origin.x, origin.y);
  c.lineCap = 'round';
  c.lineWidth = 2.2;
  c.strokeStyle = '#8c938b';
  for (let i = 0; i < 4; i++) {
    const u = 34 + i * 5;
    c.beginPath();
    c.moveTo(u, -5);
    c.lineTo(u, 4);
    c.stroke();
  }
  c.restore();
}
function detailCap(c: Context, p: Plan, height: number, r: number) {
  turned(c, p, height, height + 1.5, r, r, titanium);
  turned(c, p, height + 1.5, height + 2.6, r - 3.3, r - 3.3, ceramic);
  for (let i = 0; i < 3; i++) {
    const theta = (i * tau) / 3 + 0.3;
    const v = project(
      {
        x: p.x + (r - 6) * Math.cos(theta),
        z: p.z + (r - 6) * Math.sin(theta),
      },
      height + 2.7,
    );
    ellipse(c, v.x, v.y, 1.2, 0.65, '#7c817c');
  }
}
function workpiece(c: Context, p: Point) {
  const { x, y } = p;
  face(
    c,
    [
      { x: x - 13, y: y - 6 },
      { x: x - 3, y: y - 12 },
      { x: x + 13, y: y - 7 },
      { x: x + 4, y: y - 1 },
    ],
    '#f7a574',
  );
  face(
    c,
    [
      { x: x - 13, y: y - 6 },
      { x: x + 4, y: y - 1 },
      { x: x + 4, y: y + 12 },
      { x: x - 13, y: y + 7 },
    ],
    '#dc7446',
  );
  face(
    c,
    [
      { x: x + 4, y: y - 1 },
      { x: x + 13, y: y - 7 },
      { x: x + 13, y: y + 6 },
      { x: x + 4, y: y + 12 },
    ],
    '#ad5432',
  );
}
function floorMarks(c: Context) {
  c.save();
  c.lineWidth = 0.9;
  c.strokeStyle = '#b7bbb0';
  c.setLineDash([3, 3]);
  c.beginPath();
  c.moveTo(stations[0], 292);
  c.lineTo(stations[1], 292);
  c.stroke();
  c.setLineDash([]);
  for (const x of stations) {
    c.beginPath();
    c.ellipse(x, 292, 24, 8, 0, 0, tau);
    c.stroke();
    c.beginPath();
    c.moveTo(x - 3, 292);
    c.lineTo(x + 3, 292);
    c.stroke();
  }
  c.restore();
}
function gripper(c: Context, wrist: Point, gap: number) {
  const { x, y } = wrist;
  c.lineJoin = 'round';
  for (const side of [-1, 1]) {
    const px = (d: number) => x + side * d;
    face(
      c,
      [
        { x: px(4), y: y + 21 },
        { x: px(12), y: y + 21 },
        { x: px(gap + 2), y: y + 31 },
        { x: px(gap + 1), y: y + 47 },
        { x: px(gap - 3), y: y + 50 },
        { x: px(gap - 4), y: y + 34 },
      ],
      graphite.wall[2],
    );
    c.strokeStyle = '#303635';
    c.lineWidth = 0.85;
    c.stroke();
    face(
      c,
      [
        { x: px(10), y: y + 24 },
        { x: px(gap), y: y + 32 },
        { x: px(gap - 1), y: y + 40 },
        { x: px(gap - 2), y: y + 32 },
      ],
      '#aab0ab',
    );
  }
}
export function drawArm(c: Context, wrist: Point, part: Point, grip: number) {
  c.clearRect(stage.x, stage.y, stage.width, stage.height);
  const tip: Plan = { x: wrist.x, z: 8 + (wrist.y - rest.y) * 0.46 };
  // SCARA inverse kinematics in the horizontal plane; the quill handles vertical travel.
  const dx = tip.x - base.x,
    dz = tip.z - base.z,
    reach = Math.hypot(dx, dz);
  const upper = 158,
    fore = 155;
  const heading =
    Math.atan2(dz, dx) -
    Math.acos(
      Math.min(
        1,
        (upper * upper + reach * reach - fore * fore) / (2 * upper * reach),
      ),
    );
  const elbow = {
    x: base.x + upper * Math.cos(heading),
    z: base.z + upper * Math.sin(heading),
  };
  const quill = ground + tip.z * tilt - wrist.y;
  floorMarks(c);
  shadow(c, 250, 284, 186, 32, 0.17);
  shadow(c, base.x + 3, 281, 70, 21, 0.35);
  shadow(
    c,
    part.x + 2,
    292,
    18,
    6,
    Math.max(0.05, 0.24 - (cubeFloor - part.y) * 0.002),
  );
  loom(c, elbow);
  platform(c);
  housingLayers(c, base, elbow, 33, 24, 108, 24);
  detailCap(c, base, 132, 21);
  vents(c, base, elbow, 132.1);
  turned(c, elbow, 132, 142, 21, 21, graphite);
  turned(c, elbow, 142, 145, 21, 21, titanium);
  // The lower end of the quill is occluded by its guide housing.
  const guide = { x: tip.x - 6, z: tip.z + 1 };
  turned(c, guide, quill + 2, Math.max(quill + 3, 146), 2.1, 2.1, graphite);
  turned(c, tip, quill + 1, Math.max(quill + 2, 145), 5.2, 5.2, titanium);
  housingLayers(c, elbow, tip, 27, 18, 145, 21);
  detailCap(c, elbow, 166, 17);
  // The narrow steel quill passes through the fixed graphite linear bearing.
  vents(c, elbow, tip, 166.1);
  turned(c, tip, 166, 176, 12, 12, graphite);
  const travel = Math.max(4, quill - 67);
  turned(c, tip, 176, 176 + travel * 0.42, 5, 5, titanium);
  // Draw the actuator from bottom to top so its cap never hides the collar.
  turned(c, tip, quill - 23, quill - 12, 12, 15, graphite);
  turned(c, tip, quill - 12, quill - 9, 15, 15, orange);
  turned(c, tip, quill - 9, quill + 2, 15, 11, titanium);
  workpiece(c, part);
  gripper(c, wrist, 20 - grip * 6);
}
