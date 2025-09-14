export const createPipePair = ({
    x,
    width,
    topHeight,
    bottomStartY,
    bottomHeight,
    passed = false,
    }) => {
    let newPipe = {
        x,
        width,
        topHeight,
        bottomStartY,
        bottomHeight,
        passed,
        }
        return newPipe;
    };
    
export const setPipeX = ({ pipe, x}) => {
    let newPipeX = { ...pipe, x };
    return newPipeX;
};

export const setPipePassed = ({ pipe, passed }) => {
    let passedPipe = { ...pipe, passed };
    return passedPipe; 
};

export const getPipeHTML = ({ pipe, fieldAirHeight }) => {
  let html = `
    <div class="pipePair" style="left:${pipe.x}px; width:${pipe.width}px; height:${fieldAirHeight}px;">
      <div class="pipeTop" style="top:0; height:${pipe.topHeight}px;"></div>
      <div class="pipeBottom" style="top:${pipe.bottomStartY}px; height:${pipe.bottomHeight}px;"></div>
    </div>
  `;
  return html;
};

export const getAllPipesHTML = ({ pipes, fieldAirHeight }) => {
    let pipeHTMLArray = pipes.map(pipe => getPipeHTML({ pipe, fieldAirHeight }));

    let combinedHTML = pipeHTMLArray.join("");

    return combinedHTML;
};