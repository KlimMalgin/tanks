/**
 * Class LevelCompiler
 */
class LevelCompiler {
    constructor(levelData) {
        this.data = levelData;
    }

    // В указанных координатах есть описание поверхности?
    hasSurface(x, y) {
        let map = this.data.map;
        if (map[x] && map[x][y] && map[x][y].surface) {
            return true;
        }
        return false;
    }

    hasBuilding(x, y) {
        let map = this.data.map;
        if (map[x] && map[x][y] && map[x][y].building) {
            return true;
        }
        return false;
    }

    hasRespawn(x, y) {
        let map = this.data.map;
        if (map[x] && map[x][y] && map[x][y].respawn) {
            return true;
        }
        return false;
    }

    /**
     * Вернет данные о команде. Все неготовые к использованию
     * поля - подготовит, например, вместо id спрайта подставит
     * его наименование и т.д.
     */
    getTeamData(teamId) {
        // тут вернуть объект команды со спрайтами и всей инфой, чтобы дальше отдать его в респаун и танку, чтоб знали в какой они команде
        let teams = this.data.teams;
        return {
            ...teams[teamId],
            teamId: teamId,
            respawnSprite: this._textureFile(teams[teamId].respawnSprite),
            unitSprite: this._textureFile(teams[teamId].unitSprite)
        };
    }

    /**
     * Обойти набор команд и вызвать коллбек на каждой итерации. Принцип классического map.
     * Результаты выполнения коллбеков сформируют новый набор данных.
     */
    mapTeams(callback) {
        let teams = this.data.teams,
            result = {};
        for (let key in teams) {
            if (!teams.hasOwnProperty(key)) continue;
            result[key] = callback(this.getTeamData(teams[key].teamId));
        }

        return result;
    }

    _textureFile = (name) => this.data.spriteHash[name]
}



export default LevelCompiler;
