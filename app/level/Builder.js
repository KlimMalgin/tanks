import { Sprite } from 'pixi.js';
import { ScaledContainer, Wall } from '../display';
import Resources from '../resources/Resources';
import DisplayStore from '../stores/DisplayStore';

export default class LevelBuilder {
    constructor(levelData) {

        //console.log('Hi, i am LevelBuilder!', ScaledContainer);
        this._createLevelElements(levelData);
        //this._createBuildings(levelData);
    }

    _createLevelElements(levelData) {
        let surfaceTile = null,
            buildingTile = null,
            containerWidth = levelData.width * levelData.tileSize,
            containerHeight = levelData.height * levelData.tileSize;

        this.backgroundLayer = new ScaledContainer(containerWidth, containerHeight);
        this.buildingsLayer = new ScaledContainer(containerWidth, containerHeight);

        for (var y = 0; y<levelData.width; y++) {
            for (var x = 0; x<levelData.height; x++) {
                if (levelData.map[x][y].surface) {
                    surfaceTile = new Sprite(Resources.getTexture(levelData.map[x][y].surface));
                    surfaceTile.position.set(x * levelData.tileSize, y * levelData.tileSize);
                    // Фон не реализует никаких действий, поэтому можно добавить его напрямую в контейнер
                    this.backgroundLayer.addChild(surfaceTile);
                }

                if (levelData.map[x][y].building) {
                    buildingTile = new Wall(levelData.map[x][y].building);
                    buildingTile.position.set(x * levelData.tileSize, y * levelData.tileSize);
                    DisplayStore.create(buildingTile, this.buildingsLayer);
                }
            }
        }
    }

    ground() {
        return this.backgroundLayer;
    }

    buildings() {
        return this.buildingsLayer;
    }

    respawn() {
        return {};
    }
}


