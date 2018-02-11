import Component from 'engine/Component';
import Input from 'engine/Input';
import SpriteMaterial from 'engine/materials/SpriteMaterial';
import Camera from 'engine/Camera';
import TestScene from 'scenes/TestScene';
import Entity from 'engine/entities/Entity';

type keys = 'RIGHT' | 'LEFT' | 'ACTION';

enum PlayerStates {
    WORLD,
    EXAMINE
}

class PlayerComponent extends Component {
    private _material           : SpriteMaterial;
    private _speed              : number;
    private _camera             : Camera;
    private _scene              : TestScene;
    private _state              : PlayerStates;

    public static readonly ComponentName           : string = "PlayerComponent";

    private _input = {
        LEFT: 0,
        RIGHT: 0,
        ACTION: 0
    };

    constructor() {
        super(PlayerComponent.ComponentName);

        this._speed = 1.5;
        this._state = PlayerStates.WORLD;
    }

    private _handleKeyboard(keyCode: number, value: number): void {
        let key: keys = null;
        if (keyCode == 68) { key = 'RIGHT'; } else 
        if (keyCode == 65) { key = 'LEFT'; } else 
        if (keyCode == 69) { key = 'ACTION'; }

        if (key != null) {
            if (this._input[key] == 2 && value == 1) {
                return;
            }

            this._input[key] = value;
        }
    }

    private _updateMovement(): void {
        let hor = this._input.RIGHT - this._input.LEFT;
        if (hor != 0) {
            this._entity.position.x += this._speed * hor;
            this._material.scale[0] = hor;

            this._material.playAnimation("walk");
        } else {
            this._material.playAnimation("stand");
        }
    }

    private _followCamera(): void {
        let pos = this._entity.position.x,
            cameraSize = 854 / 8;

        if (pos < cameraSize) { pos = cameraSize; }
        if (pos >= this._entity.scene.size.x - cameraSize) { pos = this._entity.scene.size.x - cameraSize; }

        this._camera.position.x = pos;
        this._camera.target.x = pos;
    }

    private _checkAction(): void {
        this._scene.hideActionButton();
        
        let collision: Entity = null;
        if (collision = this._entity.scene.checkCollisionAtLayer(this._entity, "Entities")) {
            if (this._input.ACTION == 1) {
                this._scene.showActionPanel(collision);
                this._state = PlayerStates.EXAMINE;
                this._input.ACTION = 2;
            } else {
                this._scene.showActionButton();
            }
        }
    }

    public start(): void {
        this._material = <SpriteMaterial>this._entity.material;
        this._scene = <TestScene>this._entity.scene;
        this._camera = this._entity.scene.camera;

        Input.addListener("keydown", (ev: KeyboardEvent) => { this._handleKeyboard(ev.keyCode, 1); });
        Input.addListener("keyup", (ev: KeyboardEvent) => { this._handleKeyboard(ev.keyCode, 0); });
    }

    public update(): void {
        switch (this._state) {
            case PlayerStates.WORLD:
                this._updateMovement();
                this._checkAction();
                this._followCamera();
                break;
        }
    }

    public destroy(): void {

    }
}

export default PlayerComponent;