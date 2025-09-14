import { CONFIG } from "./config.js";
import { limitValue } from "./utils.js";


export const updateBird = ({bird, deltaTime, input}) => {

    let velocity = bird.velocity;

    if (input.flap) {
        velocity = CONFIG.BIRD.FLAP
    };


    velocity = velocity + CONFIG.BIRD.GRAVITY * deltaTime;


    let newBirdY = bird.y + velocity * deltaTime;

    let maxBirdY = CONFIG.FIELD.HEIGHT - CONFIG.FIELD.GROUND_HEIGHT - bird.height;
    newBirdY = limitValue({value: newBirdY, min: -180, max: maxBirdY});
    
    let newBird = {
        ...bird,
        y: newBirdY,
        velocity,
    };

    return newBird;
};

export const renderBird = ({ bird, container }) => {
    let birdElement = container.querySelector("#bird");

    if (!birdElement) {
        birdElement = document.createElement("div");
        birdElement.id = "bird";
        container.append(birdElement)
    }

    birdElement.style.width = bird.width + "px";
    birdElement.style.height = bird.height + "px";
    birdElement.style.transform = `translate(${bird.x - bird.width / 2}px, ${bird.y - bird.height / 2}px)`;
};