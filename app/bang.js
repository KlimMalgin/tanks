

function initBang () {
    loader
        //.add('public/tanks.sprite.json')
        .add('public/bang.sprite.json')
        .load(onBangLoaded);
}

function onBangLoaded() {
    
    // create an array of textures from an image path
    var frames = [];

    frames.push(PIXI.Texture.fromFrame('green-tank.png'));
    frames.push(PIXI.Texture.fromFrame('bang1.png'));
    frames.push(PIXI.Texture.fromFrame('bang2.png'));
    frames.push(PIXI.Texture.fromFrame('bang3.png'));
    
    // create a MovieClip (brings back memories from the days of Flash, right ?)
    movie = new PIXI.extras.MovieClip(frames);

    /*
     * A MovieClip inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    movie.x = 200;
    movie.y = 400;

    movie.anchor.set(0.5);
    movie.animationSpeed = 0.21;

    movie.loop = false;
    
    movie.width = 64;
    movie.height = 64;

    movie.onComplete = function() {
        movie.destroy();
        movie = null;    
    };

    stage.addChild(movie);
    
}