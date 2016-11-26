/**
 * Класс описывает одну из разновидностей снарядов - простую пулю.
 */
import { Sprite } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import { config } from '../../../package.json';
import AnimationStore from '../../stores/AnimationStore';
import DisplayStore from '../../stores/DisplayStore';
import { guid, CollisionManager } from '../../utils';

export default class Bullet extends Sprite {

    /**
     * Конструктор для пули
     * @param {String} direction Направление выстрела
     * @param {Number} speed Скорость патрона
     * @param {Object} startPosition Содержит координаты стартовой позиции пули
     */
    constructor(direction, speed, startPosition, parentUnit) {
        super(Resources.getTexture(config.ammo.bullet));

        this.type = 'bullet';

        this.guid = guid();
        console.log('bullet guid: ', this.guid, this);

        this.parentUnit = parentUnit;

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.width = this.width / 2;
        this.height = this.height / 2;

        /**
         * Ускорение при движении по горизонтали
         */
        this.vx = 0;

        /**
         * Ускорение при движении по вертикали
         */
        this.vy = 0;

        /**
         * Начальное позиционирование относительно стрелявшего юнита
         */
        this.x = startPosition.x;
        this.y = startPosition.y;

        /**
         * Задаем направление движения
         */
        this._setDirection(direction, speed);

        /**
         * Создаем постоянную onDraw-функцию с привязанным контекстом для
         * дальнейшего добавления/удаления её в сторе
         */
        this.onDrawWrapper = this.onDraw.bind(this);

        // Снаряды нужно в менеджер коллизий?
        // CollisionManager.add(this);

        AnimationStore.addChangeListener(this.onDrawWrapper);
    }

    /**
     * Деструктор для подготовки класса снаряда к удалению из памяти
     */
    destructor() {
        AnimationStore.removeChangeListener(this.onDrawWrapper);
    }

    onDraw() {
        this.x += this.vx;
        this.y += this.vy;
        this._checkCollision();
        this._checkForDestroy();
    }

    /**
     * Установить направление движения в сторону direction с ускорением speed
     */
    _setDirection(direction, speed) {
        switch(direction) {
            case 'up':
                this.vy = -speed;
                break;

            case 'down':
                this.vy = speed;
                break;

            case 'left':
                this.vx = -speed;
                break;

            case 'right':
                this.vx = speed;
                break;

            default:
                this.vy = -speed;
                break;
        }
    }

    /**
     * Провери пора ли удалять патрон с игрового поля.
     * Если пора - сгенерирует соответствующее событие
     * для DisplayStore.
     */
    _checkForDestroy() {
        if (this.x < 0 || this.x > config.stageWidth || this.y < 0 || this.y > config.stageHeight) {
            //console.log('destroy: %o', this);
            DisplayStore.destroy(this);
        }
    }

    _checkCollision() {
        /**
         * Проверить столкновение текущего патрона со всеми танками на поле
         */
        let collisionList = CollisionManager.checkAll(this, 'tank', [this.parentUnit]);

        if (collisionList.length) {
            console.log('>>> Есть коллизия: ', collisionList);
            collisionList.forEach((item) => {
                DisplayStore.destroy(item);
            });
            DisplayStore.destroy(this);
        }
    }
}
