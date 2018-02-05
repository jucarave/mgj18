import Scene from 'engine/Scene';
import EntitiesFactory from 'factories/EntitiesFactory';
import Camera from 'engine/Camera';
import Matrix4 from 'engine/math/Matrix4';
import Renderer from 'engine/Renderer';

class TestScene extends Scene {
    constructor(renderer: Renderer) {
        super(renderer);

        this._camera = new Camera(Matrix4.createOrtho(854/4, 480/4, 0.1, 1000.0));
        this._camera.setPosition(0.0, 0.0, 3.0);

        this._initLayers();
        this._initEntities();
    }

    private _initLayers(): void {
        this._addLayer("Entities");
    }

    private _initEntities(): void {
        this.addInstance(EntitiesFactory.createPlayer(0.0, 0.0), "Entities");
    }
}

export default TestScene;