export const createBird = ({ CONFIG }) => {
  let newBird = {
    x: CONFIG.BIRD.START.x,
    y: CONFIG.BIRD.START.y,
    width: CONFIG.BIRD.BODY.width,
    height: CONFIG.BIRD.BODY.height,
    velocityY: CONFIG.BIRD.VELOCITY.y,
  };
  return newBird;
};



export const setBirdVelocityY = ({ bird, velocityY }) => {
    let newBirdSpeed = { ...bird, velocityY };

    return newBirdSpeed
};



export const setBirdY = ({ bird, y }) => {
    let nextBirdPositionY = { ...bird, y };

    return nextBirdPositionY;
};



export const limitBirdY = ({ bird, topLimit, bottomLimit }) => {
    const limitedY = Math.max(topLimit, Math.min(bird.y, bottomLimit));
    const velocityY = limitedY !== bird.y ? 0 : bird.velocityY;

    let limitedBird = { ...bird, y: limitedY, velocityY };

    return limitedBird
};



export const getBirdStyle = ({ bird }) => {
  let birdCSS = {
    left: `${bird.x}px`,
    top: `${bird.y}px`,
    width: `${bird.width}px`,
    height: `${bird.height}px`,
  };
  return birdCSS;
};