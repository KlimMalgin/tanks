/**
 * Класс, который отвечает за работу с оружием в целом.
 * Все вызовы идут через этот класс.
 */
import { Bullet } from '../display/Ammo';


export default class Weapon {

    /**
     * Сгенерирует выстрел. Создаст экземпляр заданного патрона, его скорость,
     * направление и прочее. И Разместит патрон на игровом поле.
     * @param {String} type Разновидность патрона
     * @param {String} direction Направление выстрела
     * @param {Number} speed Скорость патрона
     * @param {Object} startPosition Содержит координаты стартовой позиции пули
     */
    static fire(type, ...args) {
        switch (type) {
            case 'Bullet':
                return new Bullet(...args);

            default:
                console.error('Такого снаряда не существует!');
        }

        return null;
    }
}
