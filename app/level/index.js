
import testLevel from './data.json';

import LevelBuilder from './Builder';

export { testLevel };

export function levelFactory(levelData) {
    return new LevelBuilder(levelData);
}