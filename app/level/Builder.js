import { Sprite } from 'pixi.js';
//import { DisplayGroup } from 'pixi-display';
import { ScaledContainer, Wall, Respawn } from '../display';
import Resources from '../resources/Resources';
import DisplayStore from '../stores/DisplayStore';

export default class LevelBuilder {
    constructor(levelData) {
        this.levelData = levelData;

        //debugger;
        //console.log('DisplayGroup: ', DisplayGroup);
        this._createLayers();
        //this._createLevelElements(levelData);
    }

    _createLayers() {
        let containerWidth = this.levelData.width * this.levelData.tileSize,
            containerHeight = this.levelData.height * this.levelData.tileSize;

        this.backgroundLayer = new ScaledContainer(containerWidth, containerHeight);
        this.buildingsLayer = new ScaledContainer(containerWidth, containerHeight);
        this.respawnsLayer = new ScaledContainer(containerWidth, containerHeight);
    }

    createLevelElements() {
        let levelData = this.levelData,
            surfaceTile = null,
            buildingTile = null,
            respawnTile = null;

        let teams = levelData.teams;


        console.log('tileSize: ', levelData.tileSize);

        for (var y = 0; y<levelData.height; y++) {
            for (var x = 0; x<levelData.width; x++) {
                let coord = {
                        x: x * levelData.tileSize,
                        y: y * levelData.tileSize
                    },
                    map = levelData.map,
                    textureFile = (name) => levelData.spriteHash[name];

                if (map[x] && map[x][y] && map[x][y].surface) {
                    surfaceTile = new Sprite(Resources.getTexture(textureFile(map[x][y].surface)));
                    surfaceTile.position.set(coord.x, coord.y);

                    //surfaceTile.displayGroup = bgDG;
                    // Фон не реализует никаких действий, поэтому можно добавить его напрямую в контейнер
                    this.backgroundLayer.addChild(surfaceTile);
                }

                if (map[x] && map[x][y] && map[x][y].building) {
                    buildingTile = new Wall(textureFile(map[x][y].building));
                    buildingTile.position.set(
                        coord.x + (buildingTile.width / 2),
                        coord.y + (buildingTile.height / 2)
                    );
                    //buildingTile.displayGroup = buildDG;
                    DisplayStore.create(buildingTile, this.buildingsLayer);
                }

                if (map[x] && map[x][y] && map[x][y].respawn) {
                    let rX, rY,
                        team = teams[map[x][y].respawn.team];

                    respawnTile = new Respawn(textureFile(team.respawnSprite), textureFile(team.unitSprite), coord, team.managed);
                    rX = coord.x + (respawnTile.width / 2),
                    rY = coord.y + (respawnTile.height / 2);
                    respawnTile.position.set(rX, rY);

                    // todo: хак для сохранения позиции респауна на поле. Внутри респауна почему-то всегда нулевой position-объект
                    //respawnTile.startPosition = { x: rX, y: rY };
                    DisplayStore.create(respawnTile, this.respawnsLayer);
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


