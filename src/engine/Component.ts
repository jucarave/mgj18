import Entity from 'engine/entities/Entity';

abstract class Component {
    protected _entity                   : Entity;
    
    public readonly name                : string;

    constructor(componentName: string) {
        this._entity = null;
        this.name = componentName;
    }

    public setEntity(entity: Entity): void {
        this._entity = entity;
    }

    public start(): void {}

    public update(): void {}

    public postUpdate(): void {}

    public destroy(): void {}
}

export default Component;