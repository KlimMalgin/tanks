
import testLevel from './data.json';
import LevelBuilder from './Builder';

let levelParams = {
    stageWidth: testLevel.width * testLevel.tileSize,
    stageHeight: testLevel.height * testLevel.tileSize
};

export { testLevel, levelParams };

export function levelFactory(levelData) {
    return new LevelBuilder(levelData);
}