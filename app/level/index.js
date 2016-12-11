
import testLevelData from './data.json';
import LevelBuilder from './Builder';
import LevelCompiler from './LevelCompiler';

let levelParams = {
        stageWidth: testLevelData.width * testLevelData.tileSize,
        stageHeight: testLevelData.height * testLevelData.tileSize
    },
    levelInstance = new LevelCompiler(testLevelData);

export { levelInstance, levelParams };

export function levelFactory(levelData) {
    return new LevelBuilder(levelData);
}