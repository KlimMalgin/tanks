import EventEmitter from 'events';
import { CREATE_TEAM, UPDATE_TEAM } from '../constants/AppConstants';
import { isFunction } from '../utils';


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
            this.teams[updateTeamData.teamId] = this._calculate(this.teams[updateTeamData.teamId], updateTeamData);
            this.emit(UPDATE_TEAM, this.teams[updateTeamData.teamId], updateTeamData);
        } else {
            console.error("Такой команды не существует!")
        }

        console.log('TEAMS: %o', this.teams);
    }

    addCreateListener(callback) {
        this.on(CREATE_TEAM, callback);
    }

    addUpdateListener(callback) {
        this.on(UPDATE_TEAM, callback);
    }

    /**
     * Статический инкремент
     * incValue Величина на которую увеличиваем целевое значение
     * incremented Целевое значение, которое будет увеличено на величину incValue
     */
    increment(incValue) {
        return (incremented) => {
            return incremented + incValue;
        };
    }

    /**
     * Если в updateData объекте есть вычисляемые поля, они
     * будут вычислены и метод вернет объект со значениями
     *
     * TODO: Функция требует рефакторинга. Получилась какая-то магия.
     * TODO: Как узнать какого типа параметр нужен для updateData[key]) и сколько?
     */
    _calculate(currentData, updateData) {
        let result = {
            ...currentData
        };
        for (let key in updateData) {
            if (!updateData.hasOwnProperty(key)) continue;
            if (isFunction(updateData[key])) {
                result[key] = updateData[key](result[key] || 0);
            } else {
                result[key] = updateData[key];
            }
        }

        return result;
    }
}

export default new GameStore();
