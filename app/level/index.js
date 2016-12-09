
import testLevelData from './data.json';
import LevelBuilder from './Builder';
import LevelCompiler from './LevelCompiler';

let levelParams = {
    stageWidth: testLevelData.width * testLevelData.tileSize,
    stageHeight: testLevelData.height * testLevelData.tileSize
};

export { LevelCompiler, testLevelData, levelParams };

export function levelFactory(levelData) {
    return new LevelBuilder(levelData);
}