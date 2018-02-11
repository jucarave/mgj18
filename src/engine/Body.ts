import Entity from "./entities/Entity";
import SpriteMaterial from "./materials/SpriteMaterial";

class Body {
    private _entity             : Entity;
    private _width              : number;
    private _height             : number;
    
    public anchor               : Array<number>;

    constructor(entity: Entity, width: number, height: number) {
        this._entity = entity;
        this._width = width;
        this._height = height;
    }

    public collidesWith(body: Body): boolean {
        let bbox = this.boundingBox,
            other = body.boundingBox;

        if (bbox[2] < other[0] || bbox[0] >= other[2] || bbox[3] < other[1] || bbox[1] >= other[3]) {
            return false;
        }

        return true;
    }

    public get boundingBox(): Array<number> {
        if (!this.anchor) {
            this.anchor = (<SpriteMaterial>this._entity.material).getCurrentAnimation().anchor;
        };

        let ret: Array<number>,
            x1 = this._entity.position.x - this.anchor[0],
            y1 = this._entity.position.y + this.anchor[1],
            x2 = x1 + this._width,
            y2 = y1 - this._height;

        ret = [ x1, y2, x2, y1 ];

        return ret;
    }
}

export default Body;