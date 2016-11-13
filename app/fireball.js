/* global resources, Sprite */

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
    
    this.addChild(fireball);
    
}