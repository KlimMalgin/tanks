
import { test } from './test'

class Game { 
  constructor () {
    console.log('Game constructor');
  }
  
  test() {
    console.assert(true == true, 'test assert');
  }
};

let tanks = new Game();

tanks.test();

test.test();