import { Sprite } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import { guid } from '../../utils';
import { Tank } from '../index';
import RespawnStore from '../../stores/RespawnStore';

//import DisplayStore from '../../stores/DisplayStore';

export default class Respawn extends Sprite {
    constructor(name) {
        super(Resources.getTexture(name));

        this.type = 'respawn';

        this.guid = guid();

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.loop = false;
        this.animationSpeed = 0.21;

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
                this.respawnMyUnit(freelyRespawns[this.guid]);
            }
        });
    }

    destructor() {}

    /**
     * Действия которые должны выполниться с объектов при перерисовке сцены
     */
    onDraw() {}

    /**
     * Пересоздать юнита связанного с текущей respawn-точкой
     */
    respawnMyUnit(unitProps) {
        console.log('Пересоздаем юнит типа %o на респауне № %o ', unitProps.type, this.guid);
    }
}