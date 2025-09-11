// import "./styles.css";

// Field

const fieldWidth = 400; //größe vom echten hintergrund, später bild einfügen
const fieldHeight = 708;

// Pipes

const pipeWidth = 60;    //px
const pipeGap = 120;   //px  
const pipeSpeed = 100;   //px/s   
const pipeSpawnInterval = 2; // sekunden

let pipes = [];       // in top und bottom pipes aufteilen   

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
// define Bird

function createBird() {
    const birdElement = document.createElement("div");
    birdElement.id = "bird";

    DOM.entities.append(birdElement);

    DOM.birdElement = birdElement;
}
function updateBirdState() {}

//create Bird div

function renderBird() {
  if (!DOM.birdElement) return;
  DOM.birdElement.style.width  = bird.width + "px";
  DOM.birdElement.style.height = bird.height + "px";
  DOM.birdElement.style.transform = `translate(${bird.x - bird.width / 2}px, ${bird.y - bird.height / 2}px)`;
}

// -----------PIPES---------

function spawnPipe() {}         
function updatePipeState() {}
function renderPipes() {}

// -----------UI---------

function createUI() {}
function updateUI() {}
function renderUI() {}

// ---------RULES----------

function checkGameState() {}
function gameTick() {}
function runGame() {
    createGameContainer();
    createBird();
    renderGameContainer();
    renderBird();
};
function restartGame() {}


runGame();


