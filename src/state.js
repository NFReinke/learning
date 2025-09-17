import { CONFIG } from "./config.js"

const getBirdStartPosition = ({ FIELD }) => ({
    x: Math.round( FIELD.WIDTH / 6 ),
    y: Math.round( FIELD.HEIGHT / 2 ),
});

export const createInitialState = () => {
    const field = CONFIG.FIELD;
    const bird = CONFIG.BIRD;
    
    const start = getBirdStartPosition({ FIELD: CONFIG.FIELD });

    return {
        time: { now: 0 },
        
        field: {
            width: field.WIDTH,
            height: field.HEIGHT,
            groundHeight: field.GROUND_HEIGHT,
        },
        bird: {
            x: start.x,
            y: start.y,
            width: bird.BODY.WIDTH,
            height: bird.BODY.HEIGHT,
            velocityY: bird.VELOCITY_Y,
            flapCooldownUntil: 0,
        },

        pipes: [],
        timeSinceLastPipe: 0,
        
        score: 0,
        phase: "start",
    }; 
};