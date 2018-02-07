import Component from 'engine/Component';
import Input from 'engine/Input';
import SpriteMaterial from 'engine/materials/SpriteMaterial';

type keys = 'RIGHT' | 'LEFT';

class PlayerComponent extends Component {
    private _material           : SpriteMaterial;
    private _speed              : number;


    public static readonly ComponentName           : string = "PlayerComponent";

    private _input = {
        LEFT: 0,
        RIGHT: 0
    };

    constructor() {
        super(PlayerComponent.ComponentName);

        this._speed = 1.5;
    }

    private _handleKeyboard(keyCode: number, value: number): void {
        let key: keys = null;
        if (keyCode == 68) { key = 'RIGHT'; } else 
        if (keyCode == 65) { key = 'LEFT'; }

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

    public start(): void {
        this._material = <SpriteMaterial>this._entity.material;

        Input.addListener("keydown", (ev: KeyboardEvent) => { this._handleKeyboard(ev.keyCode, 1); });
        Input.addListener("keyup", (ev: KeyboardEvent) => { this._handleKeyboard(ev.keyCode, 0); });
    }

    public update(): void {
        this._updateMovement();
    }

    public destroy(): void {

    }
}

export default PlayerComponent;