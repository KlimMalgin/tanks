/* global PIXI, keyboard */

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

// Спрайт голубого танка для глобального доступа
var spriteBlueTank;

// Переменные для работы с клавиатурой
var left, up, right, down;

function setup() {
    fillGameField();
    initSprites();
    keyboardSetup();
    gameLoop();
}

function initSprites() {
    var textureBlueTank = resources["public/tanks.sprite.json"].textures["blue-tank.png"];
        
    spriteBlueTank = new Sprite(textureBlueTank);
    
    spriteBlueTank.vx = 0;
    spriteBlueTank.vy = 0;
}

function keyboardSetup() {
    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
    
    
//Left arrow key `press` method
  left.press = function() {

    //Change the cat's velocity when the key is pressed
    spriteBlueTank.vx = -5;
    spriteBlueTank.vy = 0;
  };

  //Left arrow key `release` method
  left.release = function() {

    //If the left arrow has been released, and the right arrow isn't down,
    //and the cat isn't moving vertically:
    //Stop the cat
    if (!right.isDown && spriteBlueTank.vy === 0) {
      spriteBlueTank.vx = 0;
    }
  };

  //Up
  up.press = function() {
    spriteBlueTank.vy = -5;
    spriteBlueTank.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && spriteBlueTank.vx === 0) {
      spriteBlueTank.vy = 0;
    }
  };

  //Right
  right.press = function() {
    spriteBlueTank.vx = 5;
    spriteBlueTank.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && spriteBlueTank.vy === 0) {
      spriteBlueTank.vx = 0;
    }
  };

  //Down
  down.press = function() {
    spriteBlueTank.vy = 5;
    spriteBlueTank.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && spriteBlueTank.vx === 0) {
      spriteBlueTank.vy = 0;
    }
  };
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

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
