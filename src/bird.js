export const createBird = ({ start, size }) => ({
  x: start.x,
  y: start.y,
  width: size.width,
  height: size.height,
  velocityY: 0,
});

export const applyGravityAndMove = ({ bird, gravity, deltaSeconds }) => {
  const nextVelocityY = bird.velocityY + gravity * deltaSeconds;
  const nextY = bird.y + nextVelocityY * deltaSeconds;
  return { ...bird, y: nextY, velocityY: nextVelocityY };
};

export const applyFlap = ({ bird, flapVelocity }) => {
  return { ...bird, velocityY: flapVelocity };
};

export const limitBirdY = ({ bird, topLimit, bottomLimit }) => {
    const limitedY = Math.max(topLimit, Math.min(bird.y, bottomLimit));
    const velocityY = limitedY !== bird.y ? 0 : bird.velocityY;

   return { ...bird, y: limitedY, velocityY };
};

export const getBirdStyle = ({ bird }) => ({
  transform: `translate3d(${Math.round(bird.x)}px, ${Math.round(bird.y)}px, 0)`,
  width: `${bird.width}px`,
  height: `${bird.height}px`,
});