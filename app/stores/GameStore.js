import EventEmitter from 'events';
import { CREATE_TEAM, UPDATE_TEAM } from '../constants/AppConstants';

/**
 * Стор хранит данные о процессе игры
 */
class GameStore extends EventEmitter {
    constructor(...args) {
        super(...args);

        /**
         * Команды, задействованные в текущей игре
         */
        this.teams = {};
    }

    /**
     * Генерирует событие создания команды. Происходит единожды при создании уровня
     * @param {Object} teamData Объект с данными команды
     */
    create(teamData) {
        this.emit(CREATE_TEAM, teamData);
    }

    /**
     * Дополняет данные команды и генерирует событие обновления
     * @param {Object} updateTeamData Данные команды, которые нужно добавить/заменить
     */
    update(updateTeamData) {
        this.emit(UPDATE_TEAM, updateTeamData);
    }

    addCreateListener(callback) {
        this.on(CREATE_TEAM, callback);
    }

    addUpdateListener(callback) {
        this.on(UPDATE_TEAM, callback);
    }
}

export default new GameStore();
