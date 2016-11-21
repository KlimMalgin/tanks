import { Sprite } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import Keyboard from '../../Keyboard/Keyboard';
import AnimationStore from '../../stores/AnimationStore';

export default class Tank extends Sprite {

    /**
     * @param {String} name Текстовое наименование спрайта
     * @param {Boolean} managed Управляемый танк или нет {true|false}
     */
    constructor(name, managed) {
        super(Resources.getTexture(name));

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.width = this.width / 2;
        this.height = this.height / 2;

        /**
         * Текущий угол поворота танка
         */
        this.rotation = 0;

        /**
         * Текущее направление
         */
        this.rotatePosition = 'up';

        /**
         * Ускорение при движении по горизонтали
         */
        this.vx = 0;

        /**
         * Ускорение при движении по вертикали
         */
        this.vy = 0;

        managed && this.listenKeyboard();
        AnimationStore.addChangeListener(this.onDraw.bind(this));
    }

    /**
     * Перемещает танк в указанном направлении с заданным ускорением
     * @param {String} direction Направление перемещения {'up','down','left','right'}
     * @param {Number} velocity Ускорение. По умолчанию == 2
     */
    go(direction, velocity = 2) {
        var rotateAngle = Math.PI / 2;
        this.stop();
        switch (direction) {
            case 'up':
                this.rotation = rotateAngle * 0;
                this.rotatePosition = direction;
                //this.vx = 0;
                this.vy -= velocity;
                break;

            case 'down':
                this.rotation = rotateAngle * -2;
                this.rotatePosition = direction;
                //this.vx = 0;
                this.vy += velocity;
                break;

            case 'left':
                this.rotation = rotateAngle * -1;
                this.rotatePosition = direction;
                this.vx -= velocity;
                //this.vy = 0;
                break;

            case 'right':
                this.rotation = rotateAngle * 1;
                this.rotatePosition = direction;
                this.vx += velocity;
                //this.vy = 0;
                break;
        }
    }

    /**
     * Прекращает движение танка
     */
    stop() {
        this.vx = 0;
        this.vy = 0;
    }

    /**
     * Действия которые должны выполниться с объектов при перерисовке сцены
     */
    onDraw() {
        this.x += this.vx;
        this.y += this.vy;
    }

    listenKeyboard() {
        const onRelease = (params) => {
                  this.stop();
                  !!params.isDown && this.go(params.isDown);
              };

        Keyboard.on('down', () => { this.go('down'); });
        Keyboard.on('downRelease', onRelease);

        Keyboard.on('up', () => { this.go('up'); });
        Keyboard.on('upRelease', onRelease);

        Keyboard.on('left', () => { this.go('left'); });
        Keyboard.on('leftRelease', onRelease);

        Keyboard.on('right', () => { this.go('right'); });
        Keyboard.on('rightRelease', onRelease);
    }
}