import { CONFIG } from "./config.js";

const createBaseDom = () => {
  let game = document.getElementById("game");
  if (!game) {
    const app = document.getElementById("app") || document.body;
    game = document.createElement("div");
    game.id = "game";
    app.append(game);
  }

  let entities = document.getElementById("entities");
  if (!entities) {
    entities = document.createElement("div");
    entities.id = "entities";
    game.append(entities);
  }

  let bird = document.getElementById("bird");
  if (!bird) {
    bird = document.createElement("div");
    bird.id = "bird";
    game.append(bird);
  }

  let ground = document.getElementById("ground");
  if (!ground) {
    ground = document.createElement("div");
    ground.id = "ground";
    game.append(ground);
  }

  let score = document.getElementById("score");
  if (!score) {
    score = document.createElement("div");
    score.id = "score";
    game.append(score);
  }

  let overlay = document.getElementById("overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.display = "none";
    overlay.setAttribute("aria-live", "polite");
    game.append(overlay);
  }
return { game, entities, bird, ground, score, overlay };
};

export const startUI = ({ config = CONFIG }) => {
  const { game, entities, bird, ground, score, overlay } = createBaseDom();

  const fieldWidth = config.FIELD.WIDTH;
  const fieldHeight = config.FIELD.HEIGHT;
  const groundHeight = config.FIELD.GROUND_HEIGHT;

  document.documentElement.style.setProperty("--field-width", `${fieldWidth}px`);
  document.documentElement.style.setProperty("--field-height", `${fieldHeight}px`);
  document.documentElement.style.setProperty("--ground-height", `${groundHeight}px`);

  const groundPeriodSec = fieldWidth / config.PIPES.SPEED;
  document.documentElement.style.setProperty("--ground-period", `${groundPeriodSec}s`);

  bird.style.width = `${config.BIRD.BODY.WIDTH}px`;
  bird.style.height = `${config.BIRD.BODY.HEIGHT}px`;

  return { game, entities, bird, ground, score, overlay };
};

const pipesToHTML = ({ pipes, playfieldHeight }) => {
  return pipes.map(pipe => {
    const left = pipe.x;
    const width = pipe.width;
    const topHeight = pipe.topHeight;
    const bottomY = pipe.bottomStartY;
    const bottomHeight = pipe.bottomHeight;

    return `
      <div class="pipePair" style="left:${left}px; width:${width}px; height:${playfieldHeight}px;">
        <div class="pipeTop" style="top:0; height:${topHeight}px;"></div>
        <div class="pipeBottom" style="top:${bottomY}px; height:${bottomHeight}px;"></div>
      </div>
    `;
  }).join("");
};

export const render = ({ state, elements }) => {
  const { entities, bird, score, ground, overlay } = elements;
  const playfieldHeight = CONFIG.FIELD.HEIGHT - CONFIG.FIELD.GROUND_HEIGHT;

  const desired = state.phase === "running" ? "running" : "paused";
  if (ground && ground.style.animationPlayState !== desired) {
    ground.style.animationPlayState = desired;
  }

  bird.style.transform = `translate3d(${state.bird.x}px, ${state.bird.y}px, 0)`;
  entities.innerHTML = pipesToHTML({ pipes: state.pipes, playfieldHeight });
  if (score) score.textContent = String(state.score);

  if (overlay) {
    if (state.phase === "start") {
      overlay.textContent = "Press SPACE or Click to start";
      overlay.style.display = "flex";
    } else if (state.phase === "gameover") {
      overlay.textContent = "Game Over — press to restart";
      overlay.style.display = "flex";
    } else {
      overlay.style.display = "none";
    }
  }
};

