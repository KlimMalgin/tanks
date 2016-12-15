import { Text } from 'pixi.js';
import { ScaledContainer } from '../../display';

export default class GameOver extends ScaledContainer {

    constructor(...args) {
        super(...args);

        //this.alpha = 0.5;

        this.createText(...args);
        //this.createScoreText(...args);
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

    createScoreText(...args) {
        var styleGreen = {
                fontFamily : 'Arial',
                fontSize : '16px',
                fontWeight : 'bold',
                fill : '#00ED00',
                stroke : '#4a1850',
                strokeThickness : 5
            },
            styleBlue = {
                fontFamily : 'Arial',
                fontSize : '16px',
                fontWeight : 'bold',
                fill : '#a0bff5',
                stroke : '#4a1850',
                strokeThickness : 5
            };

        let scoreTextGreen = new Text('54', styleGreen),
            scoreTextBlue = new Text('54', styleBlue);

        scoreTextGreen.anchor.x = 0.5;
        scoreTextGreen.anchor.y = 0.5;
        scoreTextGreen.x = 150;
        scoreTextGreen.y = 15;

        scoreTextBlue.anchor.x = 0.5;
        scoreTextBlue.anchor.y = 0.5;
        scoreTextBlue.x = args[0] - 150;
        scoreTextBlue.y = 15;

        this.addChild(scoreTextGreen);
        this.addChild(scoreTextBlue);
    }
}
