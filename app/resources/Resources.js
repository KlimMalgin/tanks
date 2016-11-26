import { loader } from 'pixi.js';
//import textures from './sprotes.js';    // <-- sprotes.js -> textures.js

let resources = loader.resources;

class Resources {

    constructor() {
        // TODO: Пока работает только с одним файлом спрайта
        this.resources = [
            "public/tanks.sprite.json",
            "public/bang.sprite.json"
        ];
    }

    load(callback) {
        this.resources.forEach((item) => {
            loader.add(item);
        });

        loader.load((...args) => {
            this._onLoadResources(...args);
            callback();
        });
    }

    _onLoadResources() {
        console.log('resources is loaded!', arguments);
    }

    getTexture(name) {
        let ln = this.resources.length;

        for (let i = 0; i < ln; i++) {
            if (resources[this.resources[i]].textures[name]) {
                return resources[this.resources[i]].textures[name];
            }
        }

        console.error("Текстура %o не найдена!", name);

        return null;
    }
}

export default new Resources();
