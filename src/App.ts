import Renderer from 'engine/Renderer';
import SpritesManager from 'manager/SpritesManager';
import Scene from 'engine/Scene';
import TestScene from 'scenes/TestScene';
import Input from 'engine/Input';

class App {
    private _renderer           : Renderer;
    private _scene              : Scene;

    constructor() {
        this._renderer = new Renderer(854, 480, document.getElementById("divGame"));

        this._init();
    }

    private _init(): void {
        Input.init();
        SpritesManager.init(this._renderer);

        var waitLoad = () => {
            if (SpritesManager.isReady) {
                this._newGame();
            } else {
                requestAnimationFrame(() => { waitLoad(); });
            }
        };

        waitLoad();
    }

    private _newGame(): void {
        this._scene = new TestScene(this._renderer);

        this._loop();
    }

    private _loop(): void {
        // Render the game
        this._renderer.clear();

        this._scene.loop();

        requestAnimationFrame(() => {
            this._loop();
        });
    }
}

window.onload = () => {
    new App();
};