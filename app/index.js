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

var spriteBlueTank;

function setup() {
    fillGameField();
    initSprites();
    gameLoop();
}

function initSprites() {
    var textureBlueTank = resources["public/tanks.sprite.json"].textures["blue-tank.png"];
        
    spriteBlueTank = new Sprite(textureBlueTank);
    
    spriteBlueTank.vx = 0;
    spriteBlueTank.vy = 0;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    
    spriteBlueTank.vx = 1;
    spriteBlueTank.vy = 1;

    spriteBlueTank.x += spriteBlueTank.vx;
    spriteBlueTank.y += spriteBlueTank.vy;
    
    stage.addChild(spriteBlueTank);
    
    renderer.render(stage);
}

function fillGameField () {
    var tileW = 84,
        tileH = 84,
        tileCount = 7;

    var textureTile = resources["public/tanks.sprite.json"].textures["tile.png"];

    var tile = null;

    for (var i = 0; i < tileCount; i++) {
        for (var k = 0; k < tileCount; k++) {
            tile = new Sprite(textureTile);
            tile.position.set(tileW * i, tileH * k);
            stage.addChild(tile);
        }
    }
}
