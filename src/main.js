// import "./styles.css";

// Field

const fieldWidth = 400; //größe vom echten hintergrund, später bild einfügen
const fieldHeight = 708;

// Pipes

const pipeWidth = 60;    //px
const pipeGap = 180;   //px  
const pipeSpeed = 100;   //px/s   
const pipeSpawnInterval = 2; // sekunden
let topPipeHeight = 200;

let pipes =[];       // in top und bottom pipes aufteilen   

// bird

const birdBody = { width: 36, height: 30 };
const birdStart = { x: fieldWidth / 6, y: fieldHeight / 2 };

const flap = -100; 
let gravity = 100; //px/s^2

//let velocity = 0, durch bird redundant ? wird vllt noch gebraucht

let bird = {
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

//structure & QOL

let DOM = {
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

    game.append(entities);
    DOM.app.append(game, ui);

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
function renderBird() {
  if (!DOM.birdElement) return;
  DOM.birdElement.style.width  = bird.width + "px";
  DOM.birdElement.style.height = bird.height + "px";
  DOM.birdElement.style.transform = `translate(${bird.x - bird.width / 2}px, ${bird.y - bird.height / 2}px)`;
}
function updateBirdState() {}




// -----------PIPES---------

function createPipe(topPipeHeight) {
  const pipeElements = document.createElement("div");
  pipeElements.className ="pipePair";
  pipeElements.style.left = fieldWidth - pipeWidth + "px"; // pipe width entfernen, damit spawn ausserhalb vom feld
  pipeElements.style.width = pipeWidth + "px";
  pipeElements.style.height = fieldHeight + "px";
 
  const topElement = document.createElement("div");
  topElement.className = "pipeTop";
  topElement.style.height = (topPipeHeight + "px");

  const bottomElement = document.createElement("div");
  bottomElement.className = "pipeBottom";
  bottomElement.style.height = (fieldHeight - topPipeHeight - pipeGap + "px")
  bottomElement.style.top = (topPipeHeight + pipeGap + "px")


  

  pipeElements.append(topElement, bottomElement);
  DOM.entities.append(pipeElements);

  pipes.push({x: fieldWidth - pipeWidth, width: pipeWidth, topPipeHeight, gapHeight: pipeGap});
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
    renderBird();
    createPipe(topPipeHeight);
};
function restartGame() {}


runGame();


