/**
 * Index.js
 *
 * The main entry point, appends PIXI to the DOM
 * and starts a render and animation loop
 *
 */

import {config} from './config';
import Renderer from './Renderer/Renderer';
import App from './display/App/App';
import GameOver from './display/App/GameOver';
import Resources from './resources/Resources';
import { GameStore } from './stores';
//import AnimationStore from './stores/AnimationStore';
//import TWEEN from 'tween.js';

let appScreens = {
    level: null,
    gameover: null
};

const renderer = new Renderer(config.stageWidth, config.stageHeight);
const applicationContainer = document.getElementById('app');

applicationContainer.setAttribute("style","width:"+config.stageWidth+"px;height:"+config.stageHeight+"px;");
applicationContainer.style.width=config.stageWidth+'px';
applicationContainer.style.height=config.stageHeight+'px';

applicationContainer.appendChild(renderer.view);

//AnimationStore.addChangeListener(() => TWEEN.update());

console.log('Start resource loading...');
console.time('Resources');
Resources.load(() => {
    console.timeEnd('Resources');

    /*appScreens.gameover = new GameOver(config.stageWidth, config.stageHeight);
    renderer.addRenderable(appScreens.gameover);*/

    appScreens.level = new App(config.stageWidth, config.stageHeight);
    renderer.addRenderable(appScreens.level);
    renderer.start();
});

GameStore.addGameoverListener(() => {
    renderer.stop();
    appScreens.gameover = new GameOver(config.stageWidth, config.stageHeight);
    renderer.removeRenderable(appScreens.level);
    renderer.addRenderable(appScreens.gameover);
});
