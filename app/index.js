/* global PIXI, keyboard, createFireBall, fireBallProcess */

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

var fireBalls = [];

// Переменные для работы с клавиатурой
var left, up, right, down, space;

function setup() {
    fillGameField();
    initSprites();
    keyboardSetup();
    gameLoop();
}

function initSprites() {
    
    /**
     * Blue Tank
     */
    var textureBlueTank = resources["public/tanks.sprite.json"].textures["blue-tank.png"];
        
    spriteBlueTank = new Sprite(textureBlueTank);
    
    spriteBlueTank.vx = 0;
    spriteBlueTank.vy = 0;
    
    spriteBlueTank.x = 32;
    spriteBlueTank.y = 32;
    
    spriteBlueTank.width = 64;
    spriteBlueTank.height = 64;
    
    spriteBlueTank.anchor.x = 0.5;
    spriteBlueTank.anchor.y = 0.5;
    
}

function keyboardSetup() {
    var velocity = 2,
        rotateAngle = Math.PI / 2;
    
    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40),
    space = keyboard(32);
    
    
//Left arrow key `press` method
  left.press = function() {
    spriteBlueTank.rotation = rotateAngle * -1;
    spriteBlueTank.rotatePosition = 'left';
    //Change the cat's velocity when the key is pressed
    spriteBlueTank.vx = -velocity;
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
    spriteBlueTank.rotation = rotateAngle * 0;
    spriteBlueTank.rotatePosition = 'up';
    spriteBlueTank.vy = -velocity;
    spriteBlueTank.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && spriteBlueTank.vx === 0) {
      spriteBlueTank.vy = 0;
    }
  };

  //Right
  right.press = function() {
    spriteBlueTank.rotation = rotateAngle * 1;
    spriteBlueTank.rotatePosition = 'right';
    spriteBlueTank.vx = velocity;
    spriteBlueTank.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && spriteBlueTank.vy === 0) {
      spriteBlueTank.vx = 0;
    }
  };

  //Down
  down.press = function() {
    spriteBlueTank.rotation = rotateAngle * -2;
    spriteBlueTank.rotatePosition = 'down';
    spriteBlueTank.vy = velocity;
    spriteBlueTank.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && spriteBlueTank.vx === 0) {
      spriteBlueTank.vy = 0;
    }
  };
  
  //Space
  space.press = function() {
      
      var options = {
        x: spriteBlueTank.x,
        y: spriteBlueTank.y,
        direction: spriteBlueTank.rotatePosition
    };
    console.log('press space %o', options);
    
    fireBalls.push(createFireBall(options));
  };
}

function gameLoop() {
    requestAnimationFrame(gameLoop);

    spriteBlueTank.x += spriteBlueTank.vx;
    spriteBlueTank.y += spriteBlueTank.vy;
    
    stage.addChild(spriteBlueTank);
    
    // 
    fireBalls.forEach(fireBallProcess, stage);
    
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
