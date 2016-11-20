import { loader } from 'pixi.js';
//import textures from './sprotes.js';    // <-- sprotes.js -> textures.js

let resources = loader.resources;

class Resources {

    constructor() {
        // TODO: Пока работает только с одним файлом спрайта
        this.resources = [
            "public/tanks.sprite.json"
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
        return resources["public/tanks.sprite.json"].textures[name];
    }
}

export default new Resources();
