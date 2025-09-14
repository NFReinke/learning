import { CONFIG } from "./config.js";

export const getDeltaTime = ({previousFrame, currentFrame}) => {
    let deltaSec = Math.min(1/60, (currentFrame- previousFrame.lastFrameTime) / 1000);

    let nextFrame = {
        ...previousFrame,
        lastFrameTime: currentFrame,
        deltaSec
    };

    return nextFrame;
};



export const randomTopHeight = ({ pipeGap, minPipeHeight }) => {
    let minHeight = minPipeHeight;
    let maxHeight = CONFIG.FIELD.HEIGHT - CONFIG.FIELD.GROUND_HEIGHT -pipeGap - minPipeHeight;
    
    let topPipeHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

    return topPipeHeight
};

export const limitValue = ({value, min, max}) =>{
    let limitedValue =Math.max(min, Math.min(max, value));

    return limitedValue
}