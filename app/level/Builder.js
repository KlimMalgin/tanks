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

        for (var i = 0; i<levelData.width; i++) {
            for (var j = 0; j<levelData.height; j++) {
                if (levelData.map[i][j].surface) {
                    surfaceTile = new Sprite(Resources.getTexture(levelData.map[i][j].surface));
                    surfaceTile.width = levelData.tileSize;
                    surfaceTile.height = levelData.tileSize;
                    surfaceTile.position.set(i * levelData.tileSize, j * levelData.tileSize);
                    // Фон не реализует никаких действий, поэтому можно добавить его напрямую в контейнер
                    this.backgroundLayer.addChild(surfaceTile);
                }

                if (levelData.map[i][j].building) {
                    buildingTile = new Wall(levelData.map[i][j].building);
                    buildingTile.width = levelData.tileSize;
                    buildingTile.height = levelData.tileSize;
                    buildingTile.position.set(i * levelData.tileSize, j * levelData.tileSize);
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


