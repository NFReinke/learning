export const createField = ({ CONFIG }) => {
    let field = {
        fieldSize: { width: CONFIG.FIELD.WIDTH, height: CONFIG.FIELD.HEIGHT },
        groundHeight: { h: CONFIG.FIELD.GROUND_HEIGHT },
        };
    return field
};