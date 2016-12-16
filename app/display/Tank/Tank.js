import { extras } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import { Keyboard, guid, CollisionManager } from '../../utils';
import { config } from '../../config';
import Weapon from '../../Weapon';
import { DisplayStore, AnimationStore, GameStore } from '../../stores';
import { levelInstance } from '../../level';

let { AnimatedSprite } = extras;

export default class Tank extends AnimatedSprite {

    /**
     * @param {Object} teamData config-объект для танка. Содержит данные танка и команды.
     */
    constructor(teamData) {
        let frames = [];

        frames.push(Resources.getTexture(teamData.unitSprite));
        frames.push(Resources.getTexture('bang1.png'));
        frames.push(Resources.getTexture('bang2.png'));
        frames.push(Resources.getTexture('bang3.png'));

        super(frames);

        this.type = 'tank';

        this.guid = guid();

        window._myTank = this;
        console.log('tank guid: %o window._myTank = %o', this.guid, this);

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.loop = false;
        this.animationSpeed = 0.21;

        /**
         * Дает понять, что объект является юнитом
         */
        this.isUnit = true;

        /**
         * Объект находится в процессе удаления
         */
        this.isDestroyProcess = false;

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

        /**
         * Сохраняем для респаун-точки
         */
        //this.$name = name;

        /**
         * Данные о команде в которой находится танк
         */
        this.teamData = teamData;

        /**
         * Танк является управляемым или нет. Управляемый для
         * текущего игрока, неуправляемый - другие игроки или боты.
         */
        this.isPlayer = teamData.isPlayer;

        CollisionManager.add(this);

        teamData.isPlayer && this._listenKeyboard();
        AnimationStore.addChangeListener(this.onDrawWrapper);

        this.onComplete = this._afterAnimation;
    }

    destructor() {
        AnimationStore.removeChangeListener(this.onDrawWrapper);
        CollisionManager.remove(this);

        if (this.isPlayer) {
            Keyboard.removeAllListeners('down');
            Keyboard.removeAllListeners('downRelease');
            Keyboard.removeAllListeners('up');
            Keyboard.removeAllListeners('upRelease');
            Keyboard.removeAllListeners('left');
            Keyboard.removeAllListeners('leftRelease');
            Keyboard.removeAllListeners('right');
            Keyboard.removeAllListeners('rightRelease');
            Keyboard.removeAllListeners('space');
        }
    }

    /**
     * Перемещает танк в указанном направлении с заданным ускорением
     * @param {String} direction Направление перемещения {'up','down','left','right'}
     * @param {Number} velocity Ускорение. По умолчанию == 2
     */
    go(direction, velocity = 2) {
        if (this.isDestroyProcess == false) {
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
        if (this.vx != 0 || this.vy != 0) {
            this._checkCollision();
        }
        this._checkAndMove();
    }

    /**
     * Запустит анимацию уничтожения, по окончанию которой объект будет уничтожен
     */
    animatedDestroy() {
        // TODO: Не останавливает движение?
        this.isDestroyProcess = true;
        this.stop();
        this.play();
    }

    /**
     * onComplete колбек, который вызывается по окончании анимации текущего спрайта
     */
    _afterAnimation() {
        //console.warn('animation complete ', this);
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
            this._fire();
        });
    }

    _fire() {
        if (this.isDestroyProcess == false) {
            Weapon.fire({
                ...levelInstance.data.ammo.Bullet,
                direction: this.rotatePosition,
                startPosition: this._weaponStartPosition(this.rotatePosition),
                parentUnit: this
            });
        }
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
        if ((wd2 >= x && x > this.x) || ((config.stageWidth - wd2) <= x && x < this.x)) {
            //console.log('X: Разрешен только выезд на поле из-за его пределов, если танк вдруг там оказался x: %o, y: %o, wd2: %o, hd2: %o, stageWidth: %o, stageHeight: %o', x, y, wd2, hd2, config.stageWidth, config.stageHeight);
            this.x = x;
        }
        // Аналогично
        else if ((hd2 >= y && y > this.y) || ((config.stageHeight - hd2) <= y && y < this.y)) {
            //console.log('Y: Разрешен только выезд на поле из-за его пределов, если танк вдруг там оказался x: %o, y: %o, wd2: %o, hd2: %o, stageWidth: %o, stageHeight: %o', x, y, wd2, hd2, config.stageWidth, config.stageHeight);
            this.y = y;
        }
        // Когда танк находится в пределах поля - можно перемещаться в любых направлениях
        else if (x != this.x && wd2 <= x && (config.stageWidth - wd2) >= x) {
            //console.log('X: Когда танк находится в пределах поля - можно перемещаться в любых направлениях x: %o, y: %o, wd2: %o, hd2: %o, stageWidth: %o, stageHeight: %o', x, y, wd2, hd2, config.stageWidth, config.stageHeight);
            this.x = x;
        } else if (y != this.y && hd2 <= y && (config.stageHeight - hd2) >= y) {
            //console.log('Y: Когда танк находится в пределах поля - можно перемещаться в любых направлениях x: %o, y: %o, wd2: %o, hd2: %o, stageWidth: %o, stageHeight: %o', x, y, wd2, hd2, config.stageWidth, config.stageHeight);
            this.y = y;
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

    /**
     * Проверяем коллизии текущего танка с другими танками и препятствиями
     */
    _checkCollision() {
        let collisionList = CollisionManager.checkAll(this, [ 'tank', 'wall' ], [this]);

        if (collisionList.length) {
            //console.log('Коллизия Танк-Танк ', collisionList);
            collisionList.forEach((collisionObject) => {
                console.log('Коллизия %o tankDirection: %o collision: %o vx: %o vy: %o', collisionObject.collision, this.rotatePosition, collisionObject.collision.collisionSide, collisionObject.collision.vx, collisionObject.collision.vy);
                if (this.rotatePosition == collisionObject.collision.collisionSide) { this.stop(); }
            });
        }
    }

    /**
     * Включает режим бота - перемещение в случайную сторону через промежуток времени
     */
    enableBotMode() {
            // Случайное направление движения
        let xyRand = () => Math.floor((Math.random() * 4) + 1),

            // Каждые 5 сек меняем направление движения
            changeDirectionMs = 1500;

        let intrId = setInterval(() => {
                this.stop();
                if (xyRand() == 1) this.go('up');
                else if (xyRand() == 2) this.go('right');
                else if (xyRand() == 3) this.go('down');
                else if (xyRand() == 4) this.go('left');
            }, changeDirectionMs);

        // TODO: Нужно сделать once-подписку в сторах!!
        DisplayStore.addDestroyListener((objectInstance) => {
            if (objectInstance.guid == this.guid) {
                clearInterval(intrId);
            }
        });
        GameStore.addGameoverListener(() => {
            clearInterval(intrId);
        });
    }

    /**
     * Включает режим стрельбы каждые 1.5 сек
     */
    enableFireMode() {
        let fireMs = 1500,
            intrId = setInterval(() => {
                this._fire();
            }, fireMs);

        // TODO: once-подписка не подходит, нужно отписываться при уничтожении
        DisplayStore.addDestroyListener((objectInstance) => {
            if (objectInstance.guid == this.guid) {
                clearInterval(intrId);
            }
        });
        GameStore.addGameoverListener(() => {
            clearInterval(intrId);
        });
    }


}