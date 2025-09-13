// import "./styles.css";

// Field

const fieldWidth = 400; //größe vom echten hintergrund, später bild einfügen
const fieldHeight = 708;
const SAFE_MARGIN = 30;
const GROUND_HEIGHT = 100;   

const PLAYFIELD_HEIGHT = fieldHeight - GROUND_HEIGHT;
// Pipes

const pipeConfig = {
  width: 60,
  topHeight: 180,
  gap: 180,
  speed: 100,
  spawnInterval: 2.8,
}

let pipes =[];       // in top und bottom pipes aufteilen   

// bird

const birdBody = { width: 36, height: 30 };
const birdStart = { x: fieldWidth / 6 , y: fieldHeight / 2  };

const flap = -100; 
let gravity = 100; //px/s^2

//let velocity = 0, durch bird redundant ? wird vllt noch gebraucht

const bird = {
  x: birdStart.x,
  y: birdStart.y,
  width: birdBody.width,
  height: birdBody.height,
  velocity: 0,  
};

// UI

let score = 0;

// GameState

let phase = "start";   // "start" "running" "paused" "gameover"
let input = { flap: false, pause: false }; // ggf erhänzen oder entfernen, wird bei playermovement vorraussichtlich relevant

const initialGameTime = {
  lastFrameTime: performance.now(),
  deltaSec: 0,
  timeSinceLastSpawn: 0
}

const getDeltaTime = (prevGameTime, currentTime) => {
  const deltaTime = Math.min (1 / 60, (currentTime - prevGameTime.lastFrameTime) / 1000);
  return {
    ...prevGameTime,
    lastFrameTime: currentTime,
    deltaSec: deltaTime,
  };
}





// -----------GAMECONTAINER---------
// define div-structure
function applyCssVars() {
  DOM.game.style.setProperty('--field-width',  `${fieldWidth}px`);
  DOM.game.style.setProperty('--field-height', `${fieldHeight}px`);
  DOM.game.style.setProperty('--ground-height', `${GROUND_HEIGHT}px`);
  const groundPeriod = fieldWidth / pipeConfig.speed; // Sekunden
  DOM.game.style.setProperty('--ground-period', `${groundPeriod}s`);
}



function createGameContainer() {
    const game = document.createElement("div");
    game.id = "game";

    const entities = document.createElement("div");
    entities.id = "entities";
    
    const ui = document.createElement("div");
    ui.id = "ui";

    game.append(entities, ui);
    DOM.app.append(game);

    DOM.game = game;
    DOM.entities = entities;
    DOM.ui = ui;
}

function createGround() {
  const ground = document.createElement("div");
  ground.id = "ground";
  DOM.game.append(ground);    
  DOM.ground = ground;
}
// create & format div-structure

function renderGameContainer(){
  if (!DOM.game) return;
  DOM.game.style.width  = fieldWidth + "px";
  DOM.game.style.height = fieldHeight + "px"; 
}


function updateGameContainer() {}    

function convertInputToAction() {}

// -----------BIRD---------
// define Bird and create bird div

function createBird() {
    const birdElement = document.createElement("div");
    birdElement.id = "bird";

    DOM.entities.append(birdElement);

    DOM.birdElement = birdElement;
}
function renderBird({x, y}) {
  if (!DOM.birdElement) return;

  DOM.birdElement.style.width  = bird.width + "px";
  DOM.birdElement.style.height = bird.height + "px";
  DOM.birdElement.style.transform = `translate(${x- bird.width/2}px, ${y- bird.height/2}px)`;
}
function updateBirdState() {}


function createPipe({ topHeight, gap }) {
  if (!DOM.entities) return;

  const pipeElements = document.createElement("div");
  pipeElements.className = "pipePair";
  
  pipeElements.style.width  = `${pipeConfig.width}px`;
  pipeElements.style.height = `${PLAYFIELD_HEIGHT}px`;

  const topElement = document.createElement("div");
  topElement.className = "pipeTop";

  topElement.style.height = `${topHeight}px`;

  const bottomElement = document.createElement("div");
  bottomElement.className = "pipeBottom";
  bottomElement.style.height = `${PLAYFIELD_HEIGHT - (topHeight + gap)}px`;
  bottomElement.style.top    = `${topHeight + gap}px`;

  pipeElements.append(topElement, bottomElement);
  DOM.entities.append(pipeElements);

 
  pipes = [
    ...pipes,
    { x: fieldWidth, width: pipeConfig.width, topHeight, gap, element: pipeElements }
  ];
}

 
const renderPipes = () => {
  

  pipes.forEach(pipePair => {
    const element = pipePair.element;
    element.style.transform = `translate3d(${pipePair.x}px, 0, 0)`;

    const [topElement, bottomElement] = element.children;
    const bottomTop = pipePair.topHeight + pipePair.gap;

    topElement.style.height     = `${pipePair.topHeight}px`;
    bottomElement.style.top     = `${bottomTop}px`;
    bottomElement.style.height  = `${PLAYFIELD_HEIGHT - bottomTop}px`; 
  });
};


const newPipeSpawnTimer = (frameTime, deltaTime) => {
  const updatedTimeSinceSpawn = frameTime.timeSinceLastSpawn + deltaTime;

  if (updatedTimeSinceSpawn >= pipeConfig.spawnInterval) {
    return {
      nextGameTime: {...frameTime, timeSinceLastSpawn: updatedTimeSinceSpawn - pipeConfig.spawnInterval },
        spawnNow: true
      };
    }

    return  {
      nextGameTime: { ...frameTime, timeSinceLastSpawn: updatedTimeSinceSpawn },
      spawnNow: false
    };
  };
  


const updatePipeMotion = (allPipePairs, deltaTime) => {
  return allPipePairs.map(pipePair => ({
    ...pipePair,
    x: pipePair.x - pipeConfig.speed * deltaTime,
  }));
}

const randomTopHeight = (gap, margin) => {
  const minHeight = margin;
  const maxHeight = PLAYFIELD_HEIGHT - gap - margin;
  return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
};

const removeInvisiblePipes = (allPipePairs) => {
  return allPipePairs.filter(pipePair => {
    const isOnScreen = pipePair.x + pipePair.width >= 0;
    
    if (!isOnScreen) {
      pipePair.element.remove();
    }
    return isOnScreen;
  });
}
//structure & QOL

const DOM = {
  app: document.getElementById("app"),
  game: null,
  entities: null,
  ui: null, 
  birdElement: null,  
  pipeElements: [], 
};

// -----------UI---------

function createUI() {}
function updateUI() {}
function renderUI() {}

// ---------RULES----------
const requestNextFrame = (prevGameTime) => {
  requestAnimationFrame((nextGameTime) => gameLoop(nextGameTime, prevGameTime))
}

const gameLoop = (currentTime, prevGameTime) => {
  const frameTime = getDeltaTime(prevGameTime, currentTime);
  const deltaTime = frameTime.deltaSec;

  let timeForNextFrame = frameTime;

  if (phase === "running") {
    const { nextGameTime, spawnNow } = newPipeSpawnTimer(frameTime, deltaTime);

    if (spawnNow) {
      const topHeight = randomTopHeight(pipeConfig.gap, SAFE_MARGIN);
      createPipe({ topHeight, gap: pipeConfig.gap });
    }

    pipes = updatePipeMotion(pipes, deltaTime);
    pipes = removeInvisiblePipes(pipes);
    renderPipes();

    timeForNextFrame = nextGameTime;
  }

  requestNextFrame(timeForNextFrame);
};



function checkGameState() {}
function gameTick() {}
function runGame() {
    phase = "running";
    createGameContainer();
    renderGameContainer();
    applyCssVars();
    createGround();

    createBird();
    renderBird(bird);

    createPipe(pipeConfig);
    
    requestNextFrame(initialGameTime); 

};
function restartGame() {}

runGame();


