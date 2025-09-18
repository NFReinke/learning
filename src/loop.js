import { getGameState, updateGameState } from "./main.js";
import { startUI, render } from "./ui.js";

const createInputState = () => ({ flapPressed: false });

const getInput = ({ inputState }) => {
  const onFlap = (event) => {
    if (event && event.code === "Space") event.preventDefault();
    inputState.flapPressed = true;
  };

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !event.repeat) onFlap(event);
  });

  window.addEventListener("mousedown", (event) => {
    if (event.button === 0) onFlap(event);
  });
};

const getAndResetCurrentInput = ({ inputState }) => {
  const currentInput = { flapPressed: inputState.flapPressed };
  inputState.flapPressed = false;
  return currentInput;
};

const elements = startUI({});
let state = getGameState();
const inputState = createInputState();
getInput({ inputState });

let lastTimeSeconds = performance.now() / 1000;

const gameFrame = () => {
  const nowSeconds = performance.now() / 1000;
  let deltaSeconds = nowSeconds - lastTimeSeconds;
  deltaSeconds = Math.min(deltaSeconds, 0.05);

  const currentInput = getAndResetCurrentInput({ inputState });

  state = updateGameState({
    state,
    input: currentInput,
    deltaSeconds,
    now: nowSeconds,
  });

  render({ state, elements });

  lastTimeSeconds = nowSeconds;
  requestAnimationFrame(gameFrame);
};

requestAnimationFrame(gameFrame);
