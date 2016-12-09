


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

    mapTeam(teamId) {
        // тут вернуть объект команды со спрайтами и всей инфой, чтобы дальше отдать его в респаун и танку, чтоб знали в какой они команде
        return {

        };
    }
}

export default LevelCompiler;
