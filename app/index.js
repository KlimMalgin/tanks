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


const renderer = new Renderer(config.stageWidth, config.stageHeight);
const app = document.getElementById('app');

app.setAttribute("style","width:"+config.stageWidth+"px;height:"+config.stageHeight+"px;");
app.style.width=config.stageWidth+'px';
app.style.height=config.stageHeight+'px';

app.appendChild(renderer.view);

//AnimationStore.addChangeListener(() => TWEEN.update());

console.log('Start resource loading...');
console.time('Resources');
Resources.load(() => {
    console.timeEnd('Resources');

    const app = new App(config.stageWidth, config.stageHeight);
    renderer.addRenderable(app);
    renderer.start();
});

GameStore.addGameoverListener(() => {
    let go = new GameOver(config.stageWidth, config.stageHeight);
    renderer.removeRenderable(app);
    renderer.addRenderable(go);
});
