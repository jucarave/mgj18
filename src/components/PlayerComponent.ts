import Component from 'engine/Component';

class PlayerComponent extends Component {
    public static readonly ComponentName           : string = "PlayerComponent";

    constructor() {
        super(PlayerComponent.ComponentName);
    }

    public update(): void {
        this._entity.setRotation(0, 0, 3 * Math.PI / 180, true);
    }
}

export default PlayerComponent;