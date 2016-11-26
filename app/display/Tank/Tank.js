import { extras } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import { Keyboard, guid, CollisionManager } from '../../utils';
import AnimationStore from '../../stores/AnimationStore';
import { config } from '../../../package.json';
import Weapon from '../../Weapon';
import DisplayStore from '../../stores/DisplayStore';

let { AnimatedSprite } = extras;

export default class Tank extends AnimatedSprite {

    /**
     * @param {String} name Текстовое наименование спрайта
     * @param {Boolean} managed Управляемый танк или нет {true|false}
     */
    constructor(name, managed) {
        let frames = [];

        frames.push(Resources.getTexture(name));
        frames.push(Resources.getTexture('bang1.png'));
        frames.push(Resources.getTexture('bang2.png'));
        frames.push(Resources.getTexture('bang3.png'));

        super(frames);

        //console.log('>> ', extras);

        this.type = 'tank';

        this.guid = guid();
        console.log('tank guid: ', this.guid, this);

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.loop = false;
        this.animationSpeed = 0.21;

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

        /**
         * Создаем постоянную onDraw-функцию с привязанным контекстом для
         * дальнейшего добавления/удаления её в сторе
         */
        this.onDrawWrapper = this.onDraw.bind(this);

        CollisionManager.add(this);

        managed && this._listenKeyboard();
        AnimationStore.addChangeListener(this.onDrawWrapper);

        this.onComplete = this._afterAnimation;
    }

    destructor() {
        AnimationStore.removeChangeListener(this.onDrawWrapper);
        CollisionManager.remove(this);
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

    /**
     * Запустит анимацию уничтожения, по окончанию которой объект будет уничтожен
     */
    animatedDestroy() {
        this.play();
    }

    /**
     * onComplete колбек, который вызывается по окончании анимации текущего спрайта
     */
    _afterAnimation() {
        console.warn('animation complete ', this);
        this.onComplete = null;
        DisplayStore.destroy(this);
    }

    _listenKeyboard() {
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
            // TODO: Рефакторинг! Сделать Weapon.create, который будет вызывать DisplayStore
            var bullet = Weapon.fire('Bullet', this.rotatePosition, 8, this._weaponStartPosition(this.rotatePosition), this);
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

    /**
     * Вычисляем стартовую позицию для пущеного снаряда
     */
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