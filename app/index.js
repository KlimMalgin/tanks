/**
 * Index.js
 *
 * The main entry point, appends PIXI to the DOM
 * and starts a render and animation loop
 *
 */

//import './index.html';
import {config} from './config';
import Renderer from './Renderer/Renderer';
import App from './display/App/App';
import Resources from './resources/Resources';
//import AnimationStore from './stores/AnimationStore';
//import TWEEN from 'tween.js';


const renderer = new Renderer(config.stageWidth, config.stageHeight);

document.body.appendChild(renderer.view);

//AnimationStore.addChangeListener(() => TWEEN.update());

console.log('Start resource loading...');
Resources.load(() => {
    const app = new App(config.stageWidth, config.stageHeight);
    renderer.addRenderable(app);
    renderer.start();

    console.log('bg: w: %o, h: %o', app.width, app.height);

    console.log('Game start!');

});
