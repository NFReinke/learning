export const now = () => performance.now();

export const deltaSec = ({prevTime, currTime}) => Math.min((currTime - prevTime) / 1000, 0.05);