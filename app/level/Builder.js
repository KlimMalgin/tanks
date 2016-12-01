import { Sprite } from 'pixi.js';
import { ScaledContainer, Wall } from '../display';
import Resources from '../resources/Resources';


export default class LevelBuilder {
    constructor(levelData) {

        console.log('Hi, i am LevelBuilder!', ScaledContainer);
        this._createBackground(levelData);
        //this._createBuildings(levelData);
    }

    _createBackground(levelData) {
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

                    //buildingTile = new Wall(Resources.getTexture(levelData.map[i][j].building));

                    this.backgroundLayer.addChild(surfaceTile);
                    //this.buildingsLayer.addChild(buildingTile);
                }
            }
        }
    }

    _createBuildings(levelData) {

    }

    ground() {
        return this.backgroundLayer;
    }

    buildings() {
        return {};
    }

    respawn() {
        return {};
    }
}


