export const createPipePair = ({x, width, topHeight, bottomStartY, bottomHeight, passed = false }) => {
  return { x, width, topHeight, bottomStartY, bottomHeight, passed };
};

export const createPipePairFromTop = ({ x, width, topHeight, gap, playfieldHeight, passed = false, }) => {
  const bottomStartY = topHeight + gap;
  const bottomHeight = Math.max(0, playfieldHeight - bottomStartY);

  return createPipePair({ x, width, topHeight, bottomStartY, bottomHeight, passed });
};

export const randomTopHeight = ({ gap, playfieldHeight, minPipeHeight, rng = Math.random }) => {
  const minTop = minPipeHeight;
  const maxTop = Math.max(minPipeHeight, playfieldHeight - minPipeHeight - gap);

  return Math.floor(minTop + (maxTop - minTop) * rng());
};

export const movePipes = ({ pipes, speed, deltaSeconds }) => {
  const deltaX = speed * deltaSeconds; 

  return pipes.map(pipe => ({ ...pipe, x: pipe.x - deltaX }));
};

export const removeOffscreenPipes = ({ pipes }) => {
  return pipes.filter(pipe => (pipe.x + pipe.width) >= 0);
};

export const shouldSpawn = ({ now, lastSpawnAt, interval }) => {
  return (now - (lastSpawnAt ?? 0)) >= interval; // Zeiten in Sekunden
};

export const createPipePairForSpawn = ({ xAtSpawn, width, gap, playfieldHeight, minPipeHeight, rng = Math.random, }) => {
  const topHeight = randomTopHeight({ gap, playfieldHeight, minPipeHeight, rng });
  return createPipePairFromTop({ x: xAtSpawn, width, topHeight, gap, playfieldHeight });
};
