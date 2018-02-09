import Scene from 'engine/Scene';
import EntitiesFactory from 'factories/EntitiesFactory';
import Text from 'engine/entities/Text';
import Camera from 'engine/Camera';
import Matrix4 from 'engine/math/Matrix4';
import Renderer from 'engine/Renderer';
import TilesFactory from 'factories/TilesFactory';

class TestScene extends Scene {
    constructor(renderer: Renderer) {
        super(renderer);

        this._camera = new Camera(Matrix4.createOrtho(854/4, 480/4, 0.1, 1000.0));
        this._camera.setPosition(0.0, 0.0, 20.0);

        this._initLayers();
        this._initEntities();
    }

    private _initLayers(): void {
        this._addLayer("Tiles");
        this._addLayer("Entities");
        this._addLayer("UI");
    }

    private _initEntities(): void {
        this.addInstance(TilesFactory.createTestRoom(this._renderer.gl), "Tiles");

        this.addInstance(EntitiesFactory.createPlayer(0.0, 0.0), "Entities");

        let text = new Text(this._renderer, "Hola mundo", {font: 'manaspace', color: '#FFFFFF', halign: 'center'});
        text.setPosition(0, 16, 0);
        this.addInstance(text, "UI");
    }
}

export default TestScene;