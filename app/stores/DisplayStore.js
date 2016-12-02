import EventEmitter from 'events';
import { CREATE_OBJECT, DESTROY_OBJECT, ANIMATE, RESIZE } from '../constants/AppConstants';

/**
 * В DisplayStore регистрируются обработчики, которые добавляют
 * и удаляют DisplayObjects с канвы
 */
class DisplayStore extends EventEmitter {
    constructor(...args) {
        super(...args);
    }

    /**
     * Генерирует событие создания объекта
     * @param {Object} objectInstance Экземпляр создаваемого объекта
     * @param {Object} container Контейнер в который будет добавлен objectInstance
     */
    create(objectInstance, container) {
        this.emit(CREATE_OBJECT, objectInstance, container);
    }

    /**
     * Генерирует событие уничтожения объекта
     * @param {Object} objectInstance Экземпляр объекта, который нужно удалить с карты и уничтожить
     * @param {Object} container Контейнер в который будет добавлен objectInstance
     */
    destroy(objectInstance, container) {
        this.emit(DESTROY_OBJECT, objectInstance, container);
    }

    addCreateListener(callback) {
        this.on(CREATE_OBJECT, callback);
    }

    addDestroyListener(callback) {
        this.on(DESTROY_OBJECT, callback);
    }
}

export default new DisplayStore();
