import { ScaledContainer } from '../../display';
//import Background from '../Background/Background.js';
import Tank from '../Tank/Tank';
import { Wall } from '../landscape';
import DisplayStore from '../../stores/DisplayStore';

import { testLevel, levelFactory } from '../../level';

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
        });


        let level = levelFactory(testLevel),
            ground = level.ground(),
            buildings = level.buildings(),
            respawn = level.respawn();

        this.addChild(ground);
        this.addChild(buildings);


        //this.addTanks();
        this.createPlayer();
        //this.tanksGenerator();
        //this.addWall();
    }

    /*addTanks() {
        let tank = new Tank("blue-tank.png", true),
            tank2 = new Tank("green-tank.png"),
            tank3 = new Tank("green-tank.png");

        tank.position.set(150, 100);
        tank2.position.set(310, 250);
        tank3.position.set(700, 180);

        DisplayStore.create(tank);
        DisplayStore.create(tank2);
        DisplayStore.create(tank3);
    }*/

    createPlayer() {
        let tank = new Tank("blue-tank.png", true);
        tank.position.set(150, 100);
        DisplayStore.create(tank, this);
    }

    tanksGenerator() {
        let xRand = () => Math.floor((Math.random() * 800) + 1),
            yRand = () => Math.floor((Math.random() * 600) + 1);

        setInterval(() => {
            let tank = new Tank("green-tank.png", false);
            tank.position.set(xRand(), yRand());
            tank.enableBotMode();
            tank.enableFireMode();
            DisplayStore.create(tank);
        }, 3000);
    }

    addWall() {
        let wall1 = new Wall('wall1.png'),
            wall2 = new Wall('wall2.png');

        wall1.position.set(250, 350);
        wall2.position.set(250, 392);
        DisplayStore.create(wall1);
        DisplayStore.create(wall2);
    }

}