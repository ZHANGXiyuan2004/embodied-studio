import {
  cubeFloor,
  drawArm,
  graspOffset,
  rest,
  stage,
  stations,
  type Point,
} from './drawing';

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const between = (a: number, b: number, t: number) => a + (b - a) * t;

export function attachArm(
  canvas: HTMLCanvasElement,
  reduced: boolean,
  announce: (running: boolean) => void,
) {
  const context = canvas.getContext('2d');
  if (!context) return;
  let wrist = { ...rest },
    target = { ...rest };
  let station = 0,
    grip = 0;
  let part = { x: stations[station], y: cubeFloor };
  let request = 0,
    lastFrame = 0;
  type Pose = { time: number; x: number; y: number; grip: number };
  let run: { start: number; poses: Pose[] } | null = null;

  function redraw() {
    if (context) drawArm(context, wrist, part, grip);
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(box.width * scale),
      height = Math.round(box.height * scale);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    context!.setTransform(
      width / stage.width,
      0,
      0,
      height / stage.height,
      0,
      0,
    );
    redraw();
  }

  function tick(now: number) {
    request = 0;
    const delta = Math.min(64, now - lastFrame);
    lastFrame = now;
    if (run) {
      const elapsed = Math.max(0, now - run.start);
      const { poses } = run;
      const stopIndex = poses.findIndex((pose) => pose.time > elapsed);
      if (stopIndex < 0) {
        station = 1 - station;
        part = { x: stations[station], y: cubeFloor };
        wrist = target = { x: part.x, y: cubeFloor - graspOffset - 43 };
        grip = 0;
        run = null;
        announce(false);
      } else {
        const start = poses[stopIndex - 1],
          end = poses[stopIndex];
        const t = clamp((elapsed - start.time) / (end.time - start.time), 0, 1);
        const eased = t * t * (3 - 2 * t);
        wrist = {
          x: between(start.x, end.x, eased),
          y: between(start.y, end.y, eased),
        };
        grip = between(start.grip, end.grip, eased);
        // Derive the workpiece from the timeline even if a background tab skipped whole phases.
        if (stopIndex >= 7) part = { x: stations[1 - station], y: cubeFloor };
        else if (stopIndex >= 4)
          part = { x: wrist.x, y: wrist.y + graspOffset };
        queue();
      }
    } else {
      const t = reduced ? 1 : 1 - Math.exp(-delta / 66);
      wrist = {
        x: between(wrist.x, target.x, t),
        y: between(wrist.y, target.y, t),
      };
      if (Math.hypot(wrist.x - target.x, wrist.y - target.y) > 0.1) queue();
      else wrist = { ...target };
    }
    redraw();
  }
  function queue() {
    if (!request) request = requestAnimationFrame(tick);
  }
  function pointTo(x: number, y: number) {
    if (run) return;
    target = {
      x: clamp(x, 205, 453),
      y: clamp(y, 108, cubeFloor - graspOffset),
    };
    queue();
  }
  function pointAtEvent(e: PointerEvent) {
    const box = canvas.getBoundingClientRect();
    pointTo(
      ((e.clientX - box.left) / box.width) * stage.width,
      ((e.clientY - box.top) / box.height) * stage.height - graspOffset,
    );
  }
  function track(e: PointerEvent) {
    if (!reduced && e.pointerType !== 'touch') pointAtEvent(e);
  }
  // A touch scroll cancels the pointer; a completed tap sets a target.
  function tap(e: PointerEvent) {
    if (reduced || e.pointerType === 'touch') pointAtEvent(e);
  }
  function keys(e: KeyboardEvent) {
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-16, 0],
      ArrowRight: [16, 0],
      ArrowUp: [0, -16],
      ArrowDown: [0, 16],
    };
    if (!steps[e.key]) return;
    e.preventDefault();
    const [x, y] = steps[e.key];
    pointTo(target.x + x, target.y + y);
  }
  function demo() {
    if (run) return;
    const from = stations[station],
      to = stations[1 - station];
    const down = cubeFloor - graspOffset;
    if (reduced) {
      station = 1 - station;
      part = { x: to, y: cubeFloor };
      wrist = target = { x: to, y: down - 43 };
      redraw();
      announce(false);
      return;
    }
    run = {
      start: performance.now(),
      poses: [
        { time: 0, ...wrist, grip: 0 },
        { time: 410, x: from, y: down - 38, grip: 0 },
        { time: 740, x: from, y: down, grip: 0 },
        { time: 970, x: from, y: down, grip: 1 },
        { time: 1300, x: from, y: down - 60, grip: 1 },
        { time: 1820, x: to, y: down - 60, grip: 1 },
        { time: 2150, x: to, y: down, grip: 1 },
        { time: 2370, x: to, y: down, grip: 0 },
        { time: 2680, x: to, y: down - 43, grip: 0 },
      ],
    };
    announce(true);
    queue();
  }

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener('pointermove', track);
  canvas.addEventListener('pointerup', tap);
  canvas.addEventListener('keydown', keys);
  return {
    demo,
    destroy() {
      cancelAnimationFrame(request);
      observer.disconnect();
      canvas.removeEventListener('pointermove', track);
      canvas.removeEventListener('pointerup', tap);
      canvas.removeEventListener('keydown', keys);
    },
  };
}
