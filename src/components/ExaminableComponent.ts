import Component from "engine/Component";

class ExaminableComponent extends Component {
    private _itemName                              : string;

    public static readonly ComponentName           : string = "ExaminableComponent";

    constructor(itemName: string) {
        super(ExaminableComponent.ComponentName);

        this._itemName = itemName;
    }

    public get itemName(): string {
        return this._itemName;
    }
}

export default ExaminableComponent;