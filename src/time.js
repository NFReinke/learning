export const now = () => performance.now();

export const deltaTime = ({prevTime, currTime}) => Math.min((currTime - prevTime) / 1000, 1 / 60);