import { Sprite } from 'pixi.js';
import { ScaledContainer, Wall, Respawn } from '../display';
import Resources from '../resources/Resources';
import { DisplayStore, GameStore } from '../stores';


export default class LevelBuilder {
    constructor(level) {
        this.level = level;

        this._createLayers();
        this._initLevelHandlers();
    }

    _createLayers() {
        let containerWidth = this.level.data.width * this.level.data.tileSize,
            containerHeight = this.level.data.height * this.level.data.tileSize;

        this.backgroundLayer = new ScaledContainer(containerWidth, containerHeight);
        this.buildingsLayer = new ScaledContainer(containerWidth, containerHeight);
        this.respawnsLayer = new ScaledContainer(containerWidth, containerHeight);
    }

    createLevelElements() {
        let level = this.level,
            levelData = level.data,
            surfaceTile = null,
            buildingTile = null,
            respawnTile = null,
            teams = level.mapTeams((teamData) => {
                GameStore.create(teamData);
                return teamData;
            });

        for (var y = 0; y<levelData.height; y++) {
            for (var x = 0; x<levelData.width; x++) {
                let coord = {
                        x: x * levelData.tileSize,
                        y: y * levelData.tileSize
                    },
                    map = levelData.map,
                    textureFile = (name) => levelData.spriteHash[name];

                if (this.level.hasSurface(x, y)) {
                    surfaceTile = new Sprite(Resources.getTexture(textureFile(map[x][y].surface)));
                    surfaceTile.position.set(coord.x, coord.y);

                    // Фон не реализует никаких действий, поэтому можно добавить его напрямую в контейнер
                    this.backgroundLayer.addChild(surfaceTile);
                }

                if (this.level.hasBuilding(x, y)) {
                    buildingTile = new Wall(textureFile(map[x][y].building));
                    buildingTile.position.set(
                        coord.x + (buildingTile.width / 2),
                        coord.y + (buildingTile.height / 2)
                    );

                    DisplayStore.create(buildingTile, this.buildingsLayer);
                }

                if (this.level.hasRespawn(x, y)) {
                    let rX, rY,
                        teamId = map[x][y].respawn.teamId,
                        // TODO: Вот так костыльно объединяем конфигурацию команды с конфигурацией индивидуального респауна
                        respawnConfig = {
                            ...teams[teamId],
                            ...map[x][y].respawn
                        };

                    respawnTile = new Respawn(respawnConfig, coord);
                    rX = coord.x + (respawnTile.width / 2),
                    rY = coord.y + (respawnTile.height / 2);
                    respawnTile.position.set(rX, rY);

                    // todo: хак для сохранения позиции респауна на поле. Внутри респауна почему-то всегда нулевой position-объект
                    DisplayStore.create(respawnTile, this.respawnsLayer);
                }
            }
        }
    }

    _initLevelHandlers() {

        GameStore.addUpdateListener((newTeamData) => {
            console.log('TEAM: %o %o die: %o kill: %o victory: %o', newTeamData.teamId, newTeamData, newTeamData.die, newTeamData.kill, this.level.handleVictory(newTeamData));
        });

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


