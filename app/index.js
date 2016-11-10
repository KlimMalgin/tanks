/* global PIXI */

var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create the renderer
var renderer = autoDetectRenderer(
    512, 512,
    {antialias: false, transparent: false, resolution: 1}
);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new Container();

loader
  .add("public/tanks.sprite.png")
  .load(setup);

function setup() {
    var sprite = new PIXI.Sprite(
        resources["public/tanks.sprite.png"].texture
    );

    stage.addChild(sprite);
  
    renderer.render(stage);  
}