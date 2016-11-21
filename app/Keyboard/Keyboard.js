import EventEmitter from 'events';


class Keyboard extends EventEmitter {

    constructor(...args) {
        super(...args);
        var left = Keyboard.keyboard(37),
            up = Keyboard.keyboard(38),
            right = Keyboard.keyboard(39),
            down = Keyboard.keyboard(40),
            space = Keyboard.keyboard(32);

        var self = this;

        left.press = function() {
            self.emit('left', {});
        };

        left.release = function() {
            if (!right.isDown) {
                self.emit('leftRelease', {});
            }
        };

        up.press = function() {
            self.emit('up', {});
        };
        up.release = function() {
            if (!down.isDown) {
                self.emit('upRelease', {});
            }
        };

        right.press = function() {
            self.emit('right', {});
        };
        right.release = function() {
            if (!left.isDown) {
                self.emit('rightRelease', {});
            }
        };

        down.press = function() {
            self.emit('down', {});
        };
        down.release = function() {
            if (!up.isDown) {
                self.emit('downRelease', {});
            }
        };

        space.press = function() {
            self.emit('space', {});
        };
        space.release = function() {
            self.emit('spaceRelease', {});
        };

    }

    /*
    How to use:

        var keyObject = keyboard(asciiKeyCodeNumber);
        keyObject.press = function() {
            //key object pressed
        };
        keyObject.release = function() {
            //key object released
        };

        //Capture the keyboard arrow keys
        var left = keyboard(37),
            up = keyboard(38),
            right = keyboard(39),
            down = keyboard(40);

        //Left arrow key `press` method
        left.press = function() {

            //Change the cat's velocity when the key is pressed
            cat.vx = -5;
            cat.vy = 0;
        };

        //Left arrow key `release` method
        left.release = function() {

            //If the left arrow has been released, and the right arrow isn't down,
            //and the cat isn't moving vertically:
            //Stop the cat
            if (!right.isDown && cat.vy === 0) {
              cat.vx = 0;
            }
        };

    */
    static keyboard(keyCode) {
        var key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = function(event) {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
            }
            event.preventDefault();
        };

        //The `upHandler`
        key.upHandler = function(event) {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
            }
            event.preventDefault();
        };

        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    }

}

export default new Keyboard();