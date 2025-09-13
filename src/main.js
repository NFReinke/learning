// import "./styles.css";

// Field

const fieldWidth = 400; //größe vom echten hintergrund, später bild einfügen
const fieldHeight = 708;

// Pipes

const pipe = {
  width: 60,
  topHeight: 180,
  gap: 180,
  speed: 100,
  SpawnInterval: 2,
}
/*
const pipeWidth = 60;    //px
const pipeGap = 180;   //px  
const pipeSpeed = 100;   //px/s   
const pipeSpawnInterval = 2; // sekunden
let topPipeHeight = 200;
*/
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

const gameTime = {
  lastFrameTime: performance.now(),
  deltaSec: 0,
  timeSinceLastSpawn: 0
}

const updateDeltaTime = (gameTime, currentTime) => {
  const deltaTime = Math.min (0.017, (currentTime - gameTime.lastFrameTime) / 1000);
  gameTime.lastFrameTime = currentTime;
  gameTime.deltaSec = deltaTime;
  return deltaTime
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



// -----------GAMECONTAINER---------
// define div-structure

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

// create & format div-structure

function renderGameContainer() {
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

function createPipe({topHeight, gap}) {
  
  if (!DOM.entities) return;

  const pipeElements = document.createElement("div");

  pipeElements.className ="pipePair";
  pipeElements.style.left = (fieldWidth - pipe.width + "px"); // pipe.width entfernen, damit spawn ausserhalb vom feld
  pipeElements.style.width = pipe.width + "px";
  pipeElements.style.height = fieldHeight + "px";
 
  const topElement = document.createElement("div");
  topElement.className = "pipeTop";
  topElement.style.height = (topHeight + "px");

  const bottomElement = document.createElement("div");
  
  bottomElement.className = "pipeBottom";
  bottomElement.style.height = (fieldHeight - topHeight - gap + "px")
  bottomElement.style.top = (topHeight + gap + "px")
 
  pipeElements.append(topElement, bottomElement);
  DOM.entities.append(pipeElements);

  pipes.push({x: fieldWidth - pipe.width, width: pipe.width, topHeight, gap});
  DOM.pipeElements.push(pipeElements)
} 

 
function renderPipe() {}
function updatePipeState() {}

// -----------UI---------

function createUI() {}
function updateUI() {}
function renderUI() {}

// ---------RULES----------

function checkGameState() {}
function gameTick() {}
function runGame() {
    createGameContainer();
    renderGameContainer();
    createBird();
    renderBird(bird);
    createPipe(pipe);
    
};
function restartGame() {}

runGame();


