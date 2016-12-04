import { Sprite } from 'pixi.js';
import { ScaledContainer, Wall, Respawn } from '../display';
import Resources from '../resources/Resources';
import DisplayStore from '../stores/DisplayStore';

export default class LevelBuilder {
    constructor(levelData) {
        this._createLevelElements(levelData);
    }

    _createLevelElements(levelData) {
        let surfaceTile = null,
            buildingTile = null,
            respawnTile = null,
            containerWidth = levelData.width * levelData.tileSize,
            containerHeight = levelData.height * levelData.tileSize;

        this.backgroundLayer = new ScaledContainer(containerWidth, containerHeight);
        this.buildingsLayer = new ScaledContainer(containerWidth, containerHeight);
        this.respawnsLayer = new ScaledContainer(containerWidth, containerHeight);

        console.log('tileSize: ', levelData.tileSize);

        for (var y = 0; y<levelData.width; y++) {
            for (var x = 0; x<levelData.height; x++) {
                let coord = {
                        x: x * levelData.tileSize,
                        y: y * levelData.tileSize
                    },
                    map = levelData.map,
                    textureFile = (name) => levelData.spriteHash[name];

                if (map[x] && map[x][y] && map[x][y].surface) {
                    surfaceTile = new Sprite(Resources.getTexture(textureFile(map[x][y].surface)));
                    surfaceTile.position.set(coord.x, coord.y);
                    // Фон не реализует никаких действий, поэтому можно добавить его напрямую в контейнер
                    this.backgroundLayer.addChild(surfaceTile);
                }

                if (map[x] && map[x][y] && map[x][y].building) {
                    buildingTile = new Wall(textureFile(map[x][y].building));
                    buildingTile.position.set(
                        coord.x + (buildingTile.width / 2),
                        coord.y + (buildingTile.height / 2)
                    );
                    DisplayStore.create(buildingTile, this.buildingsLayer);
                }

                if (map[x] && map[x][y] && map[x][y].respawn) {
                    respawnTile = new Respawn(textureFile(map[x][y].respawn));
                    respawnTile.position.set(
                        coord.x + (respawnTile.width / 2),
                        coord.y + (respawnTile.height / 2)
                    );
                    DisplayStore.create(respawnTile);
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
        return this.respawnsLayer;
    }
}


