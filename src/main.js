import { CONFIG } from "./config.js";
import { createField } from "./field.js";
import { now, deltaTime } from "./time.js";
import { createBird, setBirdVelocityY, setBirdY, limitBirdY, getBirdStyle } from "./bird.js";
import { createPipePair, setPipeX, setPipePassed, getAllPipesHTML } from "./pipes.js";

// DOM

const $app = document.getElementById("app");

const $game = document.createElement("div");
$game.id = "game";

const $entities = document.createElement("div");
$entities.id = "entities";

const $bird = document.createElement("div");
$bird.id = "bird";

const $ground = document.createElement("div");
$ground.id = "ground";

$game.append($entities, $bird, $ground);
$app.append($game);

// new const
const fieldAirHeight = CONFIG.FIELD.HEIGHT - CONFIG.FIELD.GROUND_HEIGHT;
let lastFlapTime = 0;


// assisting functions

const randomTopHeight = () => {
  const gap = CONFIG.PIPES.GAP;
  const fieldHeight = fieldAirHeight
  const minTopHeight = CONFIG.PIPES.MIN_HEIGHT;
  const maxTopHeight = Math.max(minTopHeight, fieldHeight - gap);

  return Math.floor(minTopHeight + Math.random() * (maxTopHeight - minTopHeight));
}



const movePipes = ({ pipes, speed, deltaTime }) => {
  let moved = pipes.map(pipe => setPipeX({ pipe, x: pipe.x - speed * deltaTime }));
  return moved;
};



const getVisiblePipes = ({ pipes }) => {
  let visible = pipes.filter(pipe => pipe.x + pipe.width > 0);
  return visible;
};



const advancePipeSpawnTimer = ({ pipeSpawnTimer, deltaTime }) => {
  const timePassed = pipeSpawnTimer + deltaTime;
  const interval = CONFIG.PIPES.SPAWN_INTERVAL;
  const spawnPipeNow = timePassed >= interval;
  const nextPipeSpawnTimer = spawnPipeNow ? timePassed - interval : timePassed;

  return { spawnPipeNow, nextPipeSpawnTimer }
}

const setGroundPeriodFromSpeed = () => {
  const groundPeriodSec = CONFIG.FIELD.WIDTH / CONFIG.PIPES.SPEED; // s
  document.documentElement.style.setProperty("--ground-period", `${groundPeriodSec}s`);
};

// start gamestate

let state = {
  field: createField({ CONFIG }),
  bird: createBird({ CONFIG }),
  pipes: [],
  score: 0, 
  time: { prevTime: now(), pipeSpawnTimer: 0 }
}


// Input / Flapping
const onFlap = (e) => {
  const time = now() / 1000;

  if ( time - lastFlapTime < CONFIG.BIRD.FLAP_COOLDOWN ) return;

  lastFlapTime = time;

  if (e && e.code ==="Space") e.preventDefault();
   
  state = { ...state, bird: setBirdVelocityY({ bird: state.bird, velocityY: CONFIG.BIRD.FLAP }),}
};

window.addEventListener("keydown", (e) => e.code === "Space" && onFlap(e));
window.addEventListener("mousedown", onFlap);



// Bird
const nextBirdState = ({ bird, deltaTime }) => {
  const { y, velocityY, height: birdHeight } = bird;
  const { GRAVITY, MAX_HEIGHT } = CONFIG.BIRD;
  const fieldHeight = CONFIG.FIELD.HEIGHT;
  const groundHeight = CONFIG.FIELD.GROUND_HEIGHT;

  const newVelocityY = velocityY + GRAVITY * deltaTime;
  const newY = y + newVelocityY * deltaTime;

  let updatedBird = setBirdVelocityY({ bird, velocityY: newVelocityY });
  updatedBird = setBirdY({ bird: updatedBird, y: newY });

  const topLimit = MAX_HEIGHT 
  const bottomLimit = fieldHeight - groundHeight - birdHeight; // height könnte missverständnisse machen

  return limitBirdY({ bird: updatedBird, topLimit, bottomLimit });
};


// Pipes
const nextPipeState = ({pipes, deltaTime, pipeSpawnTimer}) => {
  const { SPEED, WIDTH, GAP, MIN_HEIGHT } = CONFIG.PIPES;
  const fieldHeight = CONFIG.FIELD.HEIGHT;
  const groundHeight = CONFIG.FIELD.GROUND_HEIGHT;
  const fieldAirHeight = fieldHeight - groundHeight;

  const movedPipes = movePipes({ pipes, speed: SPEED, deltaTime });
  const visiblePipes = getVisiblePipes({ pipes: movedPipes });

  const { spawnPipeNow, nextPipeSpawnTimer } = advancePipeSpawnTimer({ pipeSpawnTimer, deltaTime });

  let nextPipes = visiblePipes;
  
  if (spawnPipeNow) {
    const topPipeHeight = randomTopHeight();
    const bottomStartY = topPipeHeight + GAP;
    const bottomHeight = Math.max(MIN_HEIGHT, fieldAirHeight - bottomStartY);
  

  const newPipe = createPipePair ({
    x: CONFIG.FIELD.WIDTH, 
    width: WIDTH,
    topHeight: topPipeHeight,
    bottomStartY,
    bottomHeight,
    passed: false,
  });
  
  nextPipes = [ ...visiblePipes, newPipe];
};

return { nextPipes, nextPipeSpawnTimer}
};



const nextState = ({ state, currTime }) => {
  const deltaTimeInSec = deltaTime({ prevTime: state.time.prevTime, currTime });

  const updatedBird = nextBirdState({ bird: state.bird, deltaTime: deltaTimeInSec });
  const { nextPipes, nextPipeSpawnTimer } =
    nextPipeState({
      pipes: state.pipes,
      deltaTime: deltaTimeInSec,
      pipeSpawnTimer: state.time.pipeSpawnTimer
    });

  return {
    ...state,
    bird: updatedBird,
    pipes: nextPipes,
    time: { prevTime: currTime, pipeSpawnTimer: nextPipeSpawnTimer },
  };
};


const computeView = ({ state }) => {
  const birdCSS = getBirdStyle({ bird: state.bird });
  const pipesHTML = getAllPipesHTML({ pipes: state.pipes, fieldAirHeight });
  return { birdCSS, pipesHTML };
};


const applyView = ({ view }) => {
  Object.assign($bird.style, view.birdCSS);
  $entities.innerHTML = view.pipesHTML;
};


const gameLoop = () => {
  const currentTime = now();
  const newState = nextState({ state, currTime: currentTime });
  const view = computeView({ state: newState });
  applyView({ view });
  state = newState;
  requestAnimationFrame(gameLoop);
};
setGroundPeriodFromSpeed();
requestAnimationFrame(gameLoop);