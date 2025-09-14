import { CONFIG } from "./config.js";
import { createField } from "./field.js";
import { now, deltaTime } from "./time.js";
import { createBird, setBirdVelocityY, setBirdY, limitBirdY, getBirdStyle } from "./bird.js";
import { createPipePair, setPipeX, setPipePassed, getAllPipesHTML } from "./pipes.js";

