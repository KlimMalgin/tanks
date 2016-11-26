import ScaledContainer from '../ScaledContainer/ScaledContainer.js';
import Background from '../Background/Background.js';
import Tank from '../Tank/Tank';
import DisplayStore from '../../stores/DisplayStore';

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

        //console.log(Resources.getTexture("bang1.png"));

        var bg = new Background();

        super(...args);

        this.addChild(bg);


        /**
         * При создании Display-объекта - добавляем его на канву
         */
        DisplayStore.addCreateListener( objectInstance => this.addChild(objectInstance) );

        /**
         * При уничтожении Display-объекта - удаляем его с канвы
         */
        DisplayStore.addDestroyListener((objectInstance) => {
            this.removeChild(objectInstance);
            objectInstance.destructor();
            objectInstance.destroy();
        });

        //this.addTanks();
        this.createPlayer();
        this.tanksGenerator();
    }

    addTanks() {
        let tank = new Tank("blue-tank.png", true),
            tank2 = new Tank("green-tank.png"),
            tank3 = new Tank("green-tank.png");

        tank.position.set(150, 100);
        tank2.position.set(310, 250);
        tank3.position.set(700, 180);

        DisplayStore.create(tank);
        DisplayStore.create(tank2);
        DisplayStore.create(tank3);
    }

    createPlayer() {
        let tank = new Tank("blue-tank.png", true);
        tank.position.set(150, 100);
        DisplayStore.create(tank);
    }

    tanksGenerator() {
        let xRand = () => Math.floor((Math.random() * 800) + 1),
            yRand = () => Math.floor((Math.random() * 600) + 1);

        setInterval(() => {
            let tank = new Tank("green-tank.png", false);
            tank.position.set(xRand(), yRand());
            tank.enableBotMode();
            DisplayStore.create(tank);
        }, 3000);
    }

}