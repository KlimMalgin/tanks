
//import { config } from '../package.json';

import level from '../public/levels/level.json';

console.log('LEVEL: %o ', level);

let config = {
        "buildDir": "./build",
        "stageWidth": 400,
        "stageHeight": 300,
        "ammo": {
            "bullet": "fire.png"
        }
    };


export { config };
