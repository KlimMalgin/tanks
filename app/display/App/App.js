import { ScaledContainer } from '../../display';
import Tank from '../Tank/Tank';
import { Wall } from '../landscape';
import { RespawnStore, DisplayStore } from '../../stores';
import { levelInstance, levelFactory } from '../../level';

/**
 * Main App Display Object
 *
 * Adds a background and some bunnies to it's self
 *
 * @exports App
 * @extends ScaledContainer
 */
export default class App extends ScaledContainer {

    constructor(...args) {
        super(...args);

        /**
         * При создании Display-объекта - добавляем его на канву
         */
        DisplayStore.addCreateListener((objectInstance, cnt) => {
            (cnt || this).addChild(objectInstance);
        });

        /**
         * При уничтожении Display-объекта - удаляем его с канвы
         */
        DisplayStore.addDestroyListener((objectInstance, cnt) => {
            (cnt || this).removeChild(objectInstance);
            objectInstance.destructor();
            objectInstance.destroy();
            RespawnStore.emitRespawnFreely(objectInstance);
        });


        let level = levelFactory(levelInstance),
            ground = level.ground(),
            buildings = level.buildings(),
            respawn = level.respawn(),
            info = level.info();

        this.addChild(ground);
        this.addChild(buildings);
        this.addChild(respawn);
        this.addChild(info);

        level.createLevelElements();
    }

}