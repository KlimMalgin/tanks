import EventEmitter from 'events';


class Keyboard extends EventEmitter {

    constructor(...args) {
        super(...args);
        this.left = Keyboard.keyboard(37);
        this.up = Keyboard.keyboard(38);
        this.right = Keyboard.keyboard(39);
        this.down = Keyboard.keyboard(40);
        this.space = Keyboard.keyboard(32);

        var self = this;

        this.left.press = function() {
            self.emit('left', {});
        };

        this.left.release = function() {
            if (!self._isDown('right', 'up', 'down')) {
                self.emit('leftRelease', {});
            }
        };

        this.up.press = function() {
            self.emit('up', {});
        };
        this.up.release = function() {
            if (!self._isDown('right', 'left', 'down')) {
                self.emit('upRelease', {});
            }
        };

        this.right.press = function() {
            self.emit('right', {});
        };
        this.right.release = function() {
            if (!self._isDown('left', 'up', 'down')) {
                self.emit('rightRelease', {});
            }
        };

        this.down.press = function() {
            self.emit('down', {});
        };
        this.down.release = function() {
            if (!self._isDown('right', 'up', 'left')) {
                self.emit('downRelease', {});
            }
        };

        this.space.press = function() {
            self.emit('space', {});
        };
        this.space.release = function() {
            self.emit('spaceRelease', {});
        };

    }

    /**
     * Проверит находятся ли перечисленные в args кнопки в нажатом состоянии.
     * Если состояние isDown хоть одной из кнопок ...args === true - будет возвращено true
     */
    _isDown(...args) {
        return args.reduce((prev, item) => {
            return this[item].isDown || prev;
        }, false);
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