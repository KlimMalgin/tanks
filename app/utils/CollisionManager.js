

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
     * Тестирует наличие коллизии
     */
    test(r1, r2) {

        //Define the variables we'll need to calculate
        var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

        //hit will determine whether there's a collision
        hit = false;

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
                hit = true;
            } else {

                //There's no collision on the y axis
                hit = false;
            }
        } else {

            //There's no collision on the x axis
            hit = false;
        }

        //`hit` will be either `true` or `false`
        return hit;
    }
}

export default new CollisionManager();
