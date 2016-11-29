import { extras } from 'pixi.js';
import Resources from '../../resources/Resources.js';
import { guid, CollisionManager } from '../../utils';
import AnimationStore from '../../stores/AnimationStore';
import DisplayStore from '../../stores/DisplayStore';

let { AnimatedSprite } = extras;

export default class Wall extends AnimatedSprite {
    constructor(name) {
        //super(Resources.getTexture(name));

        let frames = [];

        frames.push(Resources.getTexture(name));
        frames.push(Resources.getTexture('bang1.png'));
        frames.push(Resources.getTexture('bang2.png'));
        frames.push(Resources.getTexture('bang3.png'));

        super(frames);


        this.type = 'wall';

        this.guid = guid();

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;

        this.loop = false;
        this.animationSpeed = 0.21;

        this.width = this.width / 2;
        this.height = this.height / 2;

        /**
         * Создаем постоянную onDraw-функцию с привязанным контекстом для
         * дальнейшего добавления/удаления её в сторе
         */
        this.onDrawWrapper = this.onDraw.bind(this);

        CollisionManager.add(this);

        AnimationStore.addChangeListener(this.onDrawWrapper);

        this.onComplete = this._afterAnimation;
    }

    destructor() {
        AnimationStore.removeChangeListener(this.onDrawWrapper);
        CollisionManager.remove(this);
    }

    /**
     * Действия которые должны выполниться с объектов при перерисовке сцены
     */
    onDraw() {}

    /**
     * Запустит анимацию уничтожения, по окончанию которой объект будет уничтожен
     */
    animatedDestroy() {
        this.play();
    }

    /**
     * onComplete колбек, который вызывается по окончании анимации текущего спрайта
     */
    _afterAnimation() {
        //console.warn('animation complete ', this);
        this.onComplete = null;
        DisplayStore.destroy(this);
    }
}
