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


        //console.log('App: w: %o, h: %o', this.width, this.height);
        console.log('App: ', arguments);

        //this.addBunnies();

        let tank = new Tank("blue-tank.png");

        tank.position.set(100, 100);

        this.addChild(tank);
    }

    // addBunnies() {
    //   const cx = RendererStore.get('stageCenter').x;
    //   const cy = RendererStore.get('stageCenter').y;

    //   let group1 = new BunnyGroup();
    //   let b1 = new Bunny();

    //   b1.position.x = cx;
    //   b1.position.y = cy;

    //   group1.position.x = cx;
    //   group1.position.y = cy + (RendererStore.get('stageHeight')*.25);

    //   this.addChild(b1);
    //   this.addChild(group1);
    // }

}