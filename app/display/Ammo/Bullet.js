/**
 * Класс описывает одну из разновидностей снарядов - простую пулю.
 */
import { Sprite } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import { config } from '../../../package.json';

export default class Bullet extends Sprite {

    /**
     * Конструктор для пули
     * @param {String} direction Направление выстрела
     * @param {Number} speed Скорость патрона
     * @param {Object} startPosition Содержит координаты стартовой позиции пули
     */
    constructor(direction, speed, startPosition) {
        super(Resources.getTexture(config.ammo.bullet));

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
    }

    /**
     * Установить направление движения в сторону direction с ускорением speed
     */
    _setDirection(direction, speed) {
        switch(direction) {
            case 'up':
                this.vx = -speed;
                break;

            case 'down':
                this.vx = speed;
                break;

            case 'left':
                this.vy = -speed;
                break;

            case 'right':
                this.vy = speed;
                break;

            default:
                this.vy = -speed;
                break;
        }
    }
}
