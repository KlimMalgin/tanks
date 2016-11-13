/* global PIXI */

var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache;

//Create the renderer
var renderer = autoDetectRenderer(
    588, 588,
    {antialias: false, transparent: false, resolution: 1}
);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new Container();

loader
  .add("public/tanks.sprite.json")
  .load(setup);

function setup() {

    var tileW = 84,
        tileH = 84,
        tileCount = 7;

    var textureTile = resources["public/tanks.sprite.json"].textures["tile.png"];

    var tile = null;

    for (var i = 0; i < tileCount; i++) {
        for (var k = 0; k < tileCount; k++) {
            tile = new Sprite(textureTile);
            tile.position.set(tileW * i, tileH * k);
            // TODO: Замостить поле тайлами
            
            stage.addChild(tile);
        }
    }


    var texture = resources["public/tanks.sprite.json"].textures["blue-tank.png"],
        sprite = new Sprite(texture);

    stage.addChild(sprite);
    
    
  
    renderer.render(stage);  
}