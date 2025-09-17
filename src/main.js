import { CONFIG } from "./config.js";
import { createBird, applyGravityAndMove, applyFlap, limitBirdY } from "./bird.js";
import { createPipePairForSpawn, movePipes, removeOffscreenPipes, shouldSpawn } from "./pipes.js";

const fieldWidth = CONFIG.FIELD.WIDTH;
const fieldHeight = CONFIG.FIELD.HEIGHT;
const groundHeight = CONFIG.FIELD.GROUND_HEIGHT;
const playfieldHeight = fieldHeight - groundHeight;

const birdConfig = {
  body: { width: CONFIG.BIRD.BODY.WIDTH, height: CONFIG.BIRD.BODY.HEIGHT },
  flapVelocity: CONFIG.BIRD.FLAP,
  gravity: CONFIG.BIRD.GRAVITY,
  flapCooldown: CONFIG.BIRD.FLAP_COOLDOWN,
  maxLimitOffset: CONFIG.BIRD.MAX_LIMIT_OFFSET,
};

const pipeConfig = {
  width: CONFIG.PIPES.WIDTH,
  gap: CONFIG.PIPES.GAP,
  speed: CONFIG.PIPES.SPEED,
  spawnInterval: CONFIG.PIPES.SPAWN_INTERVAL,
  minHeight: CONFIG.PIPES.MIN_HEIGHT,
};

export const hitboxesOverlap = ({ hitboxBird, hitboxPipe }) => {
  return !(
    hitboxBird.x + hitboxBird.width  <= hitboxPipe.x ||
    hitboxPipe.x  + hitboxPipe.width <= hitboxBird.x ||
    hitboxBird.y + hitboxBird.height <= hitboxPipe.y ||
    hitboxPipe.y  + hitboxPipe.height <= hitboxBird.y
  );
};

const pipePairToHitboxes = ({ pipe }) => {
  const topHitbox = { x: pipe.x, y: 0, width: pipe.width, height: pipe.topHeight };
  const bottomHitbox = { x: pipe.x, y: pipe.bottomStartY, width: pipe.width, height: pipe.bottomHeight };

  return [topHitbox, bottomHitbox];
};

export const initGameState = () => {
  const startX = Math.round(fieldWidth / 6);
  const startY = Math.round(fieldHeight / 2);
  const bird = createBird({ start: { x: startX, y: startY }, size: birdConfig.body });

  return {
    phase: "start",
    time: { now: 0, lastSpawnAt: 0, nextAllowedFlapAt: 0 },
    bird,
    pipes: [],
    score: 0,
  };
};

const updateBird = ({ bird, input, now, time, deltaSeconds }) => {
  let nextBird = bird;
  let nextTime = time;

  if (input && input.flapPressed && now >= time.nextAllowedFlapAt) {
    nextBird = applyFlap({ bird: nextBird, flapVelocity: birdConfig.flapVelocity });
    nextTime = { ...nextTime, nextAllowedFlapAt: now + birdConfig.flapCooldown };
  }

  nextBird = applyGravityAndMove({ bird: nextBird, gravity: birdConfig.gravity, deltaSeconds });

  const topLimit = birdConfig.maxLimitOffset;
  const bottomLimit = playfieldHeight - nextBird.height;
  nextBird = limitBirdY({ bird: nextBird, topLimit, bottomLimit });

  return { bird: nextBird, time: nextTime };
};

const updatePipesMotion = ({ pipes, time, now, deltaSeconds, rng = Math.random }) => {
  let nextPipes = movePipes({ pipes, speed: pipeConfig.speed, deltaSeconds });
  nextPipes = removeOffscreenPipes({ pipes: nextPipes });

  let nextTime = time;
  if (shouldSpawn({ now, lastSpawnAt: time.lastSpawnAt, interval: pipeConfig.spawnInterval })) {
    const newPipe = createPipePairForSpawn({
      xAtSpawn: fieldWidth,
      width: pipeConfig.width,
      gap: pipeConfig.gap,
      playfieldHeight,
      minPipeHeight: pipeConfig.minHeight,
      rng,
    });
    nextPipes = [...nextPipes, newPipe];
    nextTime = { ...nextTime, lastSpawnAt: now };
  }

  return { pipes: nextPipes, time: nextTime };
};

const checkPipes = ({ pipes, bird }) => {
  let scoreDelta = 0;
  let collided = false;

  const nextPipes = pipes.map((pipe) => {
    const [topHitbox, bottomHitbox] = pipePairToHitboxes({ pipe });

    if (
      hitboxesOverlap({ hitboxBird: bird, hitboxPipe: topHitbox }) ||
      hitboxesOverlap({ hitboxBird: bird, hitboxPipe: bottomHitbox })
    ) {
      collided = true;
    }

    const hasPassed = bird.x > (pipe.x + pipe.width);
    if (!pipe.passed && hasPassed) {
      scoreDelta += 1;
      return { ...pipe, passed: true };
    }
    return pipe;
  });

  return { pipes: nextPipes, scoreDelta, collided };
};

const getStartPhase = ({ state, input, now }) => {
  let { bird, time } = state;
  if (input && input.flapPressed) {
    bird = applyFlap({ bird, flapVelocity: birdConfig.flapVelocity });
    time = { ...time, nextAllowedFlapAt: now + birdConfig.flapCooldown };
    return { ...state, phase: "running", bird, time: { ...time, now } };
  }
  return { ...state, time: { ...state.time, now } };
};

const getRunningPhase = ({ state, input, deltaSeconds, now, rng = Math.random }) => {
  let { time, bird, pipes, score } = state;

  const birdUpdate = updateBird({ bird, input, now, time, deltaSeconds });
  bird = birdUpdate.bird;
  time = birdUpdate.time;

  const motion = updatePipesMotion({ pipes, time, now, deltaSeconds, rng });
  const evalRes = checkPipes({ pipes: motion.pipes, bird });

  pipes = evalRes.pipes;
  time = motion.time;
  score += evalRes.scoreDelta;

  const phase = evalRes.collided ? "gameover" : "running";
  
  return { phase, time: { ...time, now }, bird, pipes, score };
};

const getGameoverPhase = ({ state, input, now }) => {
  if (input && input.flapPressed) return initGameState();

  return { ...state, time: { ...state.time, now } };
};

export const updateGameState = ({ state, input, deltaSeconds, now, rng = Math.random }) => {
  if (state.phase === "start")   return getStartPhase({ state, input, now });
  if (state.phase === "running") return getRunningPhase({ state, input, deltaSeconds, now, rng });
  if (state.phase === "gameover")return getGameoverPhase({ state, input, now });
  return state;
};
