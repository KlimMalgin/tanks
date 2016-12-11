/**
 * Класс, который отвечает за работу с оружием в целом.
 * Все вызовы идут через этот класс.
 */
import { Bullet } from '../display/Ammo';
import DisplayStore from '../stores/DisplayStore';

export default class Weapon {

    /**
     * Сгенерирует выстрел. Создаст экземпляр заданного патрона, его скорость,
     * направление и прочее. И Разместит патрон на игровом поле.
     * @param {Object} weaponOptions Объект с данными для создания снаряда. Содержит:
     *      - Данные из config-объекта текущего уровня
     *      - direction {String} Направление выстрела
     *      - startPosition {Object} Координаты стартовой точки выстрела
     *      - parentUnit {Object} Инициатор выстрела
     */
    static fire(weaponOptions) {
        let ammo = null;
        switch (weaponOptions.type) {
            case 'Bullet':
                ammo = new Bullet(weaponOptions);
                break;

            default:
                console.error('Такого снаряда не существует!');
        }

        if (ammo) {
            DisplayStore.create(ammo);
        }

        return ammo;
    }
}
