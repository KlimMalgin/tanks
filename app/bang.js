

function initBang () {
    loader
        .add('public/bang.sprite.json')
        .load(onBangLoaded);
}

function onBangLoaded() {
    
    // create an array of textures from an image path
    var frames = [];

    frames.push(PIXI.Texture.fromFrame('bang1.png'));
    frames.push(PIXI.Texture.fromFrame('bang2.png'));
    frames.push(PIXI.Texture.fromFrame('bang3.png'));
    
    // create a MovieClip (brings back memories from the days of Flash, right ?)
    movie = new PIXI.extras.MovieClip(frames);

    /*
     * A MovieClip inherits all the properties of a PIXI sprite
     * so you can change its position, its anchor, mask it, etc
     */
    movie.position.set(200);

    movie.anchor.set(0.5);
    movie.animationSpeed = 0.17;

    movie.loop = false;

    movie.play();

    stage.addChild(movie);
    
}