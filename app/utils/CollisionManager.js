/**
 * Класс для работы с коллизиями
 */
class CollisionManager {

    constructor() {

        /**
         * Содержит ссылки на объекты расположенные на игровом поле.
         * Объекты распределены по типам для анализа коллизий между ними.
         */
        this.objects = {};

    }

    add(object) {
        if (!this.objects[object.type]) {
            this.objects[object.type] = new Map();
        }
        if (!this.objects[object.type].has(object.guid)) {
            this.objects[object.type].set(object.guid, object);
        } else {
            console.error("Элемент с таким guid уже существует! Попытка добавить элемент %o с guid %o в CollisionManager. Объект %o", object.type, object.guid, object);
        }
    }

    remove(object) {
        if (this.objects[object.type].has(object.guid)) {
            this.objects[object.type].delete(object.guid);
        } else {
            console.error("Элемента с таким guid не существует! Попытка удалить элемент %o с guid %o в CollisionManager. Объект %o", object.type, object.guid, object);
        }
    }

    /**
     * Проверит наличие коллизии объекта object со всеми объектами типа typeForCheck
     * @param {Object} object Объект, который проверяет свое столкновения с объектами типа typeForCheck
     * @param {Array} Массив typeForCheck типов объектов с которыми ожижается коллизия объекта object
     * @param {Array} exclude Массив объектов, которые исключаются из проверки коллизий
     * @return {Array} Список коллизий
     */
    checkAll(object, typeForCheck, exclude) {
        let result = [];

        typeForCheck.forEach((item) => {

            let checkingObjects = this.objects[item];
            if (checkingObjects) {
                checkingObjects.forEach((subject) => {
                    let collision = this._test(object, subject);
                    if (!this._isExclude(subject, exclude, object.teamData) && collision) {
                        result.push(this._createCollisionObject(collision, subject));
                    }
                });
            }

        });

        return result;
    }

    /**
     * Проверит, исключается ли заданный объект из проверки коллизий
     */
    _isExclude(subject, exclude, objectTeamData) {
        let result = false;
        exclude.forEach(function (excludedItem) {
            if (excludedItem == 'self' && subject.teamData) {
                if (!result) {
                    result = objectTeamData.teamId == subject.teamData.teamId;
                }
            } else {
                if (!result) {
                    result = subject.guid == excludedItem.guid;
                }
            }
        });
        return result;
    }

    /**
     * Столкновение случилось с субъектом из "своей" команды?
     */
    _isMyTeam(object, subject) {
        if (object.teamData.teamId === subject.teamData.teamId) {
            return true;
        }
        return false;
    }

    /**
     * Тестирует наличие коллизии
     */
    _test(r1, r2) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        //hit = false;
        hit = null;

        //Find the center points of each sprite
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;

        //Find the half-widths and half-heights of each sprite
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;

        //Calculate the distance vector between the sprites
        vx = r1.centerX - r2.centerX;
        vy = r1.centerY - r2.centerY;

        //Figure out the combined half-widths and half-heights
        combinedHalfWidths = r1.halfWidth + r2.halfWidth;
        combinedHalfHeights = r1.halfHeight + r2.halfHeight;

        //Check for a collision on the x axis
        if (Math.abs(vx) < combinedHalfWidths) {

            //A collision might be occuring. Check for a collision on the y axis
            if (Math.abs(vy) < combinedHalfHeights) {

                //There's definitely a collision happening
                //hit = true;
                let collisionSide = null;

                if      (vx >= vy && Math.abs(vx) >= Math.abs(vy)) { collisionSide = "left"; }
                else if (vx <= vy && Math.abs(vx) >= Math.abs(vy)) { collisionSide = "right"; }
                else if (vx <= vy && Math.abs(vx) <= Math.abs(vy)) { collisionSide = "up"; }
                else if (vx >= vy && Math.abs(vx) <= Math.abs(vy)) { collisionSide = "down"; }

                hit = {
                    vx,
                    vy,
                    collisionSide: collisionSide,
                    xDirection: vx <= 0 ? 'right' : 'left',
                    yDirection: vy <= 0 ? 'down' : 'up'
                };
            } else {

                //There's no collision on the y axis
                //hit = false;
                hit = null;
            }
        } else {

            //There's no collision on the x axis
            //hit = false;
            hit = null;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }

    /**
     * Создаст описание коллизии. Описание будет состоять из данных коллизии (collision)
     * и субъекта с которым произошла коллизия (subject)
     */
    _createCollisionObject(collision, subject) {
        return {
            collision,
            subject
        };
    }
}

export default new CollisionManager();
