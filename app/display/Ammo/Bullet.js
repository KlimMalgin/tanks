/**
 * Класс описывает одну из разновидностей снарядов - простую пулю.
 */
import { Sprite } from 'pixi.js';
import Resources from '../../resources/Resources';
import { config } from '../../config';
import { DisplayStore, AnimationStore, GameStore } from '../../stores';
import { guid, CollisionManager } from '../../utils';

export default class Bullet extends Sprite {

    /**
     * Конструктор для пули
     * @param {Object} weaponOptions Данные для создания снаряда
     */
    constructor(weaponOptions) {
        //direction, speed, startPosition, parentUnit
        super(Resources.getTexture(weaponOptions.sprite));

        this.type = 'bullet';

        this.guid = guid();
        console.log('bullet guid: ', this.guid, this);

        /**
         * Данные об инициаторе выстрела
         */
        this.parentUnit = weaponOptions.parentUnit;

        /**
         * Отдельно сохраняем teamData для снаряда. Нужно для стандартизации проверки коллизий
         */
        this.teamData = weaponOptions.parentUnit.teamData;

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        //this.width = this.width / 2;
        //this.height = this.height / 2;

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
        this.x = weaponOptions.startPosition.x;
        this.y = weaponOptions.startPosition.y;

        /**
         * Задаем направление движения
         */
        this._setDirection(weaponOptions.direction, weaponOptions.speed);

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
        this._checkCollision() && this._checkForDestroy();
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
            DisplayStore.destroy(this);
        }
    }

    _checkCollision() {
        /**
         * Проверить столкновение текущего патрона со всеми танками на поле
         * @return {Boolean} Продолжать после выполнения этой функции проверять необходимость уничтожения (true) патрона или нет (false)
         */
        let collisionList = CollisionManager.checkAll(this, [ 'tank', 'wall' ], [this.parentUnit, 'self']),
            myTeam = this.teamData;

        if (collisionList.length) {
            console.log('Коллизия Снаряд-Танк/Стена ', collisionList);
            collisionList.forEach((collisionObject) => {
                if (collisionObject.subject.teamData) {
                    // Зафиксировать kill для команды стреляющего
                    GameStore.update({
                        teamId: this.teamId,
                        // Статический каррированый метод для инкремента
                        kill: GameStore.increment(1)
                    });

                    // Зафиксировать die для команды субъекта
                    GameStore.update({
                        teamId: collisionObject.subject.teamData.teamId,
                        die: GameStore.increment(1)
                    });
                }
                collisionObject.subject.animatedDestroy();
            });
            DisplayStore.destroy(this);
            return false;
        }

        return true;
    }
}
