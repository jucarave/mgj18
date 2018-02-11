import Scene from 'engine/Scene';
import EntitiesFactory from 'factories/EntitiesFactory';
import Text from 'engine/entities/Text';
import Camera from 'engine/Camera';
import Matrix4 from 'engine/math/Matrix4';
import Renderer from 'engine/Renderer';
import TilesFactory from 'factories/TilesFactory';
import TimerComponent from 'components/TimerComponent';
import RoomsManager from 'manager/RoomsManager';
import Entity from 'engine/entities/Entity';
import ExaminableComponent from 'components/ExaminableComponent';
import SpriteMaterial from 'engine/materials/SpriteMaterial';

const TILE_SIZE = 16;

class TestScene extends Scene {
    private _player             : Entity;
    private _ui = {
        actionButton: <Entity> null,
        backPanel: <Entity> null
    };

    constructor(renderer: Renderer) {
        super(renderer);

        renderer.gl.clearColor(0.4823, 0.6274, 0.8313, 1.0);

        this._camera = new Camera(Matrix4.createOrtho(854/4, 480/4, 0.1, 1000.0));
        this._camera.setPosition(0.0, 64.0, 20.0);
        this._camera.setTarget(0.0, 64.0, 0.0);

        this._initLayers();
        this._initEntities();
        this._calculateSize();
    }

    private _calculateSize(): void {
        let width = 0,
            rooms = [
                RoomsManager.livingRoom
            ];

        for (let i=0,room;room=rooms[i];i++) {
            width += room[0].length * TILE_SIZE;
        }

        this._size.x = width;
    }

    private _initLayers(): void {
        this._addLayer("Tiles");
        this._addLayer("Entities");
        this._addLayer("UI");
    }

    private _initEntities(): void {
        this.addInstance(TilesFactory.createTestRoom(this._renderer.gl), "Tiles");

        this.addInstance(EntitiesFactory.createSearchable("couch", 8.0, 42.0), "Entities");
        this.addInstance(EntitiesFactory.createSearchable("tv", 104.0, 42.0), "Entities");
        this.addInstance(EntitiesFactory.createSearchable("table", 166.0, 42.0), "Entities");

        this._player = EntitiesFactory.createPlayer(120.0, 6.0);
        this.addInstance(this._player, "Entities");

        let text = new Text(this._renderer, "TIME: 01:45", {font: 'manaspace', color: '#FFFFFF', size: 80, halign: 'right'});
        text.addComponent(new TimerComponent());
        text.setPosition(0, 16, 0);
        this.addInstance(text, "UI");

        this._ui.actionButton = EntitiesFactory.createUIElement("actionButton", 120.0, -64.0);
        this.addInstance(this._ui.actionButton, "UI");

        this._ui.backPanel = EntitiesFactory.createUIElement("backgroundPanel", 0, -500);
        this.addInstance(this._ui.backPanel, "UI");

        let spr = EntitiesFactory.createUIElement("tv", 0, 0);
        this._ui.backPanel.addChild(spr);
        this.addInstance(spr, "UI");
    }

    public showActionButton(): void {
        this._ui.actionButton.position.x = this._player.position.x;
        this._ui.actionButton.position.y = this._player.position.y + 64;
    }

    public hideActionButton(): void {
        this._ui.actionButton.position.y = -64;
    }

    public showActionPanel(collision: Entity): void {
        let component = collision.getComponent<ExaminableComponent>(ExaminableComponent.ComponentName),
            mat = <SpriteMaterial>this._ui.backPanel.getChild(0).material;

        mat.playAnimation(component.itemName);

        this._ui.backPanel.position.x = this._camera.position.x;
        this._ui.backPanel.position.y = this._camera.position.y;
    }
}

export default TestScene;