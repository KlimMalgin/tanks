import EventEmitter from 'events';
import { RESPAWN_FREELY } from '../constants/AppConstants';

/**
 * Respawn Store
 * Получает/хранит данные об уничтоженных юнитах.
 * Распределяет этих юнитов по respawn-точкам.
 *
 * @units
 *  массив юнитов, которые еще не переродились
 *
 */
class RespawnStore extends EventEmitter {

  constructor(...args) {
    super(...args);

    this.freelyRespawns = [];
  }

  emitRespawnFreely(unit) {
    /* Тут надо фильтрануть те поля из unit, которые нужны для хранения,
    например type, respawnGUID  и положить объект с ними в this.freelyRespawns
    При пересоздании юнита - respawn-точка возьмет эти параметры и создаст юнита по ним
    */

    if (!this.freelyRespawns[unit.respawnGUID]) {
      this.freelyRespawns = {
        [unit.respawnGUID]: {
          respawnGUID: unit.respawnGUID,
          teamData: unit.teamData
        }
      };
    }

    this.emit(RESPAWN_FREELY, this.freelyRespawns);
  }

  addFreelyListener(callback) {
    this.on(RESPAWN_FREELY, callback);
  }
}

export default new RespawnStore();