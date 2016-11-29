import { Container, Sprite } from 'pixi.js';
import Resources from '../../resources/Resources';
import { config } from '../../config';

/**
 * Loads the adds the diagnostic image
 *
 * @exports Background
 * @extends Container
 */
export default class Background extends Container {

    constructor() {
        super();

        let tileW, tileH, tileCountX, tileCountY;
        let tileTexture = Resources.getTexture("tile.png");
        let bg = new Sprite(tileTexture),
            tile = null;

        tileW = bg.width = bg.width / 2;
        tileH = bg.height = bg.height / 2;

        tileCountX = config.stageWidth / tileW;
        tileCountY = config.stageHeight / tileH;

        for (let x = 0; x < tileCountX; x++) {
            for (let y = 0; y < tileCountY; y++) {
                tile = new Sprite(tileTexture);
                tile.position.set(tileW * x, tileH * y);
                this.addChild(tile);
            }
        }

    }

}