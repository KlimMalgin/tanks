import { Text } from 'pixi.js';
import { ScaledContainer } from '../../display';

export default class GameOver extends ScaledContainer {

    constructor(...args) {
        super(...args);

        //this.alpha = 0.5;

        this.createText(...args);
    }

    createText(...args) {
        var style = {
            fontFamily : 'Arial',
            fontSize : '36px',
            fontStyle : 'italic',
            fontWeight : 'bold',
            fill : '#F7EDCA',
            stroke : '#4a1850',
            strokeThickness : 5,
            dropShadow : true,
            dropShadowColor : '#000000',
            dropShadowAngle : Math.PI / 6,
            dropShadowDistance : 6,
            wordWrap : true,
            wordWrapWidth : 440
        };

        let richText = new Text('GAME OVER', style),
            meWidth = args[0] / 2,
            leftPosition = meWidth - richText.width / 2;

        richText.x = leftPosition;
        richText.y = 250;

        this.addChild(richText);
    }
}
