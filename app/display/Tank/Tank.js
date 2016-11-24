import { Sprite } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import Keyboard from '../../Keyboard/Keyboard';
import AnimationStore from '../../stores/AnimationStore';
import { config } from '../../../package.json';
import Weapon from '../../Weapon';
import DisplayStore from '../../stores/DisplayStore';

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
                this.vy -= velocity;
                break;

            case 'down':
                this.rotation = rotateAngle * -2;
                this.rotatePosition = direction;
                this.vy += velocity;
                break;

            case 'left':
                this.rotation = rotateAngle * -1;
                this.rotatePosition = direction;
                this.vx -= velocity;
                break;

            case 'right':
                this.rotation = rotateAngle * 1;
                this.rotatePosition = direction;
                this.vx += velocity;
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
        this._checkAndMove();
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

        Keyboard.on('space', () => {
            var bullet = Weapon.fire('Bullet', this.rotatePosition, 8, this._weaponStartPosition(this.rotatePosition));
            if (bullet) {
                DisplayStore.create(bullet);
            } else {
                console.log('Снаряд не создан');
            }
        });
    }

    /**
     * Проверяет расположение танка и передвигает его, если это возможно
     */
    _checkAndMove() {
        let x = this.x + this.vx,
            y = this.y + this.vy,
            wd2 = this.width / 2,
            hd2 = this.height / 2;


        // Разрешен только выезд на поле из-за его пределов, если танк вдруг там оказался
        if ((wd2 > x && x > this.x) || ((config.stageWidth - wd2) < x && x < this.x)) {
            this.x = x;
        }
        // Аналогично
        else if ((hd2 > y && y > this.y) || ((config.stageHeight - hd2) < y && y < this.y)) {
            this.y = y;
        }
        // Когда танк находится в пределах поля - можно перемещаться в любых направлениях
        else if (wd2 <= x && (config.stageWidth - wd2) >= x && hd2 <= y && (config.stageHeight - hd2) >= y) {
            this.y = y;
            this.x = x;
        }

    }

    _weaponStartPosition(direction) {
        switch (direction) {
            case 'up':
                return { x: this.x, y: this.y - Math.round(this.height / 2) };

            case 'down':
                return { x: this.x, y: this.y + Math.round(this.height / 2) };

            case 'left':
                return { x: this.x - Math.round(this.height / 2), y: this.y };

            case 'right':
                return { x: this.x + Math.round(this.height / 2), y: this.y };
        }
    }

}