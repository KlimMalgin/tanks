import ScaledContainer from '../ScaledContainer/ScaledContainer.js';
//import BunnyGroup from '../BunnyGroup/BunnyGroup.js';
//import Bunny from '../Bunny/Bunny.js';
import Background from '../Background/Background.js';
//import RendererStore from '../../stores/RendererStore.js';
import Tank from '../Tank/Tank';

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
        var bg = new Background();

        super(...args);

        this.addChild(bg);


        let tank = new Tank("blue-tank.png", true),
            tank2 = new Tank("green-tank.png"),
            tank3 = new Tank("green-tank.png");

        tank.position.set(10, 100);
        tank2.position.set(310, 250);
        tank3.position.set(800, 180);

        this.addChild(tank);
        this.addChild(tank2);
        this.addChild(tank3);
    }

}