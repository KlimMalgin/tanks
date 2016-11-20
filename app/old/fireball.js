/* global resources, Sprite, FIELD_SIZE, fireBallsForDestroy, fireBalls */

function createFireBall(options) {
    
    var textureFireBall = resources["public/tanks.sprite.json"].textures["fire.png"],
        spriteFireBall;
    
    spriteFireBall = new Sprite(textureFireBall);
    
    spriteFireBall.direction = options.direction;
    
    spriteFireBall.vx = 10;
    spriteFireBall.vy = 10;
    
    spriteFireBall.x = options.x;
    spriteFireBall.y = options.y;
    
    spriteFireBall.width = 64;
    spriteFireBall.height = 64;
    
    spriteFireBall.anchor.x = 0.5;
    spriteFireBall.anchor.y = 0.5;
    
    return spriteFireBall;
}

/**
 * Жизненный цикл FireBall
 * Контекст: объект сцены на которой отрисован патрон
 */
function fireBallProcess (fireball) {
    
    switch (fireball.direction) {
        case 'left':
            fireball.x -= fireball.vx;
            break;
            
        case 'up':
            fireball.y -= fireball.vy;
            break;
            
        case 'right':
            fireball.x += fireball.vx;
            break;
            
        case 'down':
            fireball.y += fireball.vy;
            break;
        
        default:
            // code
    }
    
    destroyTankIfCollision(fireball);
    
    if (0 < fireball.x && fireball.x < FIELD_SIZE &&
            0 < fireball.y && fireball.y < FIELD_SIZE) {
        this.addChild(fireball);    
    } else {
        fireBallsForDestroy.push(fireball);
    }
}

function fireBallDestroy() {
    fireBallsForDestroy.forEach(function (item) {
        var destroyed = fireBalls.splice(item, 1);
        destroyed[0].destroy();
    });
    
    fireBallsForDestroy = [];
}

function destroyTankIfCollision(fireball) {
    if (spriteGreenTank && testCollision(fireball, spriteGreenTank)) {
        fireBallsForDestroy.push(fireball);
        spriteGreenTank.destroy();
        spriteGreenTank = null;
    }
    
    if (movie && testCollision(fireball, movie)) {
        fireBallsForDestroy.push(fireball);
        movie.play();
    }
}