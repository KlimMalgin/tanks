import { Sprite } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import { guid } from '../../utils';
import { Tank } from '../index';
import RespawnStore from '../../stores/RespawnStore';
import DisplayStore from '../../stores/DisplayStore';

export default class Respawn extends Sprite {
    constructor(teamData, coord) {   //  respawnName, unitName, coord, managed
        super(Resources.getTexture(teamData.respawnSprite));

        this.type = 'respawn';

        this.guid = guid();

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.loop = false;
        this.animationSpeed = 0.21;

        // todo: хак для сохранения позиции респауна на поле. Внутри респауна почему-то всегда нулевой position-объект
        this.startPosition = {
            x: coord.x + (this.width / 2),
            y: coord.y + (this.height / 2)
        };

        /**
         * Создаем постоянную onDraw-функцию с привязанным контекстом для
         * дальнейшего добавления/удаления её в сторе
         */
        this.onDrawWrapper = this.onDraw.bind(this);

        // В случае уничтожения танка
        /*DisplayStore.addDestroyListener((objectInstance, cnt) => {
            (cnt || this).removeChild(objectInstance);
            objectInstance.destructor();
            objectInstance.destroy();
        });*/

        RespawnStore.addFreelyListener((freelyRespawns) => {
            if (freelyRespawns[this.guid]) {
                this._respawnMyUnit(freelyRespawns[this.guid].teamData);
            }
        });

        console.log('Создан респаун %o', this);

        this._respawnMyUnit(teamData, 0);
    }

    destructor() {}

    /**
     * Действия которые должны выполниться с объектов при перерисовке сцены
     */
    onDraw() {}

    /**
     * Пересоздать юнита связанного с текущей respawn-точкой
     */
    _respawnMyUnit(teamData, delay = 2500) {
        setTimeout(() => {
            //console.log('Пересоздаем юнит типа %o на респауне № %o в координатах %o %o // bounds: %o', unitProps && unitProps.type, this.guid, this.startPosition.x, this.startPosition.y, this.getBounds());
            let tank = new Tank(teamData);
            tank.position.set(this.startPosition.x, this.startPosition.y);
            tank.respawnGUID = this.guid;
            if (!teamData.managed) {
                tank.enableBotMode();
                tank.enableFireMode();
            }
            DisplayStore.create(tank);
        }, delay);
    }
}
