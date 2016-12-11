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
        if (!this.teams[teamData.teamId]) {
            this.teams[teamData.teamId] = teamData;
            this.emit(CREATE_TEAM, teamData);
        } else {
            console.error("Такая команда уже существует! %o", teamData);
        }
    }

    /**
     * Дополняет данные команды и генерирует событие обновления
     * @param {Object} updateTeamData Данные команды, которые нужно добавить/заменить
     */
    update(updateTeamData) {
        if (this.teams[updateTeamData.teamId]) {
            this.teams[updateTeamData.teamId] = {
                ...this.teams[updateTeamData.teamId],
                ...updateTeamData
            };
            this.emit(UPDATE_TEAM, this.teams[updateTeamData.teamId], updateTeamData);
        } else {
            console.error("Такой команды не существует!")
        }
    }

    addCreateListener(callback) {
        this.on(CREATE_TEAM, callback);
    }

    addUpdateListener(callback) {
        this.on(UPDATE_TEAM, callback);
    }
}

export default new GameStore();
