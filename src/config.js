export const CONFIG = {
  FIELD: {
    WIDTH: 400,
    HEIGHT: 708,
    GROUND_HEIGHT: 100,
  },
  PIPES: {
    WIDTH: 60,
    GAP: 140,
    SPEED: 180,
    SPAWN_INTERVAL: 1.8,
    MIN_HEIGHT: 30, 
  },
  BIRD: {
    BODY: { width: 36, height: 30 },
    START: { x: 400 / 6, y: 708 / 2 },
    FLAP: -500,
    GRAVITY: 1800,
    VELOCITY: { y: 0 },
    MAX_HEIGHT: -180, 
    FLAP_COOLDOWN: 0.2,
  },
};