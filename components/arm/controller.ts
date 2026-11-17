import { MathUtils, Vector3 } from 'three';
import { createStage, cubeHalf, rest, second, start } from './drawing';

export type ArmPhase =
  | 'ready'
  | 'picking'
  | 'holding'
  | 'placing'
  | 'demo'
  | 'complete';
type Waypoint = {
  at: number;
  position: Vector3;
  grip: number;
  load: 'table' | 'held' | 'placed';
};
const above = (p: Vector3, distance: number) => p.clone().setZ(p.z + distance);
const pose = (
  at: number,
  position: Vector3,
  grip: number,
  load: Waypoint['load'],
): Waypoint => ({ at, position: position.clone(), grip, load });

export async function attachArm(
  canvas: HTMLCanvasElement,
  model: ArrayBuffer,
  reduced: boolean,
  onChange: (phase: ArmPhase) => void,
) {
  const stage = await createStage(canvas, model);
  const tip = rest.clone(),
    target = rest.clone(),
    part = start.clone(),
    landing = start.clone();
  let phase: ArmPhase = 'ready';
  let grip = 0,
    request = 0,
    lastFrame = 0;
  let queuedDrop: Vector3 | null = null;
  let flight: {
    start: number;
    poses: Waypoint[];
    origin: Vector3;
    destination: Vector3;
    finish: () => void;
  } | null = null;
  function change(value: ArmPhase) {
    phase = value;
    onChange(value);
  }
  function redraw() {
    stage.draw(
      tip,
      part,
      grip,
      ['picking', 'holding', 'placing'].includes(phase) ? landing : null,
    );
  }
  function queue() {
    if (!request) request = requestAnimationFrame(tick);
  }
  function tick(now: number) {
    request = 0;
    const delta = Math.min(64, now - lastFrame);
    lastFrame = now;
    if (flight) {
      const { poses, origin, destination, finish } = flight;
      const last = poses[poses.length - 1];
      const elapsed = reduced
        ? last.at
        : Math.min(last.at, Math.max(0, now - flight.start));
      const index = poses.findIndex((p) => p.at > elapsed);
      const a = index < 0 ? last : poses[index - 1],
        b = index < 0 ? last : poses[index];
      const t = a === b ? 1 : MathUtils.smoothstep(elapsed, a.at, b.at);
      tip.lerpVectors(a.position, b.position, t);
      grip = MathUtils.lerp(a.grip, b.grip, t);
      part.copy(
        a.load === 'held' ? tip : a.load === 'placed' ? destination : origin,
      );
      if (elapsed === last.at) {
        flight = null;
        target.copy(tip);
        finish();
      } else queue();
    } else {
      tip.lerp(target, reduced ? 1 : 1 - Math.exp(-delta / 60));
      if (tip.distanceToSquared(target) > 0.000001) queue();
      else tip.copy(target);
      if (phase === 'holding') part.copy(tip);
    }
    redraw();
  }
  function play(poses: Waypoint[], destination: Vector3, finish: () => void) {
    flight = {
      start: performance.now(),
      poses,
      origin: part.clone(),
      destination: destination.clone(),
      finish,
    };
    queue();
  }
  function finishPlacement() {
    change('complete');
  }
  function place(point: Vector3) {
    if (phase === 'picking') {
      queuedDrop = point.clone();
      return;
    }
    if (phase !== 'holding') return;
    landing.copy(point);
    change('placing');
    play(
      [
        pose(0, tip, 1, 'held'),
        pose(230, above(point, 0.1), 1, 'held'),
        pose(475, point, 1, 'placed'),
        pose(630, point, 0, 'placed'),
        pose(850, above(point, 0.11), 0, 'placed'),
      ],
      point,
      finishPlacement,
    );
  }
  function pick() {
    if (phase !== 'ready' && phase !== 'complete') return;
    queuedDrop = null;
    landing.copy(part);
    change('picking');
    play(
      [
        pose(0, tip, 0, 'table'),
        pose(240, above(part, 0.085), 0, 'table'),
        pose(475, part, 0, 'table'),
        pose(620, part, 1, 'held'),
        pose(850, above(part, 0.13), 1, 'held'),
      ],
      part,
      () => {
        change('holding');
        if (queuedDrop) {
          const point = queuedDrop;
          queuedDrop = null;
          place(point);
        } else {
          target.copy(above(landing, 0.13));
          queue();
        }
      },
    );
  }
  function demo() {
    if (phase !== 'ready' && phase !== 'complete') return;
    const to =
      part.distanceToSquared(start) < part.distanceToSquared(second)
        ? second
        : start;
    change('demo');
    play(
      [
        pose(0, tip, 0, 'table'),
        pose(340, above(part, 0.09), 0, 'table'),
        pose(630, part, 0, 'table'),
        pose(850, part, 1, 'held'),
        pose(1140, above(part, 0.14), 1, 'held'),
        pose(1600, above(to, 0.14), 1, 'held'),
        pose(1900, to, 1, 'placed'),
        pose(2110, to, 0, 'placed'),
        pose(2410, above(to, 0.12), 0, 'placed'),
      ],
      to,
      finishPlacement,
    );
  }
  function aim(point: Vector3) {
    landing.copy(point);
    if (phase !== 'picking') target.copy(above(landing, 0.13));
    queue();
  }
  function track(event: PointerEvent) {
    if (
      event.pointerType === 'touch' ||
      phase === 'demo' ||
      phase === 'placing' ||
      queuedDrop
    )
      return;
    if (reduced && phase !== 'holding') return;
    const point = stage.floorAt(event);
    if (point) aim(point);
  }
  function click(event: MouseEvent) {
    if (event.button !== 0) return;
    const point = stage.floorAt(event);
    if (point) place(point);
  }
  function keys(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (event.repeat) return;
      if (phase === 'holding' || phase === 'picking') place(landing);
      else pick();
      return;
    }
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-0.025, 0],
      ArrowRight: [0.025, 0],
      ArrowUp: [0, 0.025],
      ArrowDown: [0, -0.025],
    };
    const step = delta[event.key];
    if (!step) return;
    event.preventDefault();
    if (flight) return;
    aim(
      new Vector3(
        MathUtils.clamp(landing.x + step[0], 0.3, 0.62),
        MathUtils.clamp(landing.y + step[1], -0.24, 0.24),
        cubeHalf,
      ),
    );
  }
  function resize() {
    stage.resize();
    redraw();
  }
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const panel = canvas.parentElement!;
  panel.addEventListener('pointermove', track);
  canvas.addEventListener('click', click);
  canvas.addEventListener('keydown', keys);
  return {
    pick,
    demo,
    setReducedMotion(value: boolean) {
      reduced = value;
      queue();
    },
    destroy() {
      cancelAnimationFrame(request);
      observer.disconnect();
      panel.removeEventListener('pointermove', track);
      canvas.removeEventListener('click', click);
      canvas.removeEventListener('keydown', keys);
      stage.destroy();
    },
  };
}
