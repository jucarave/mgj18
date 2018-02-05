import Vector3 from 'engine/math/Vector3';
import Matrix4 from 'engine/math/Matrix4';
import Geometry from 'engine/geometry/Geometry';
import Material from 'engine/materials/Material';

class Entity {
    protected _geometry             : Geometry;
    protected _material             : Material;
    protected _position             : Vector3;
    protected _rotation             : Vector3;
    protected _transformation       : Matrix4;
    protected _needsUpdate          : boolean;

    constructor(geometry: Geometry, material: Material) {
        this._geometry = geometry;
        this._material = material;
        this._position = new Vector3();
        this._rotation = new Vector3();
        this._transformation = Matrix4.createIdentity();
        this._needsUpdate = true;
    }

    public render(): void {
        if (!this._material.isReady()) { return; }

        let gl = this._geometry.gl,
            shader = this._material.shader,
            
            transform = this.transformation;

        gl.uniformMatrix4fv(shader.uniforms["uPosition"], false, transform.data); 

        this._material.render();
        this._geometry.render(shader);
    }

    public setPosition(x: number, y: number, z:number, relative: boolean = false): void {
        if (relative) {
            this._position.add(x, y, z);
        } else {
            this._position.set(x, y, z);
        }

        this._needsUpdate = true;
    }

    public setRotation(x: number, y: number, z:number, relative: boolean = false): void {
        if (relative) {
            this._rotation.add(x, y, z);
        } else {
            this._rotation.set(x, y, z);
        }

        this._needsUpdate = true;
    }

    public get material(): Material {
        return this._material;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public get rotation(): Vector3 {
        return this._rotation;
    }

    public get transformation(): Matrix4 {
        if (!this._needsUpdate) {
            return this._transformation;
        }

        this._transformation.setIdentity();

        this._transformation.translate(this._position.x, this._position.y, this._position.z);
        this._transformation.multiply(Matrix4.createXRotation(this._rotation.x));
        this._transformation.multiply(Matrix4.createYRotation(this._rotation.y));
        this._transformation.multiply(Matrix4.createZRotation(this._rotation.z));

        this._needsUpdate = false;

        return this._transformation;
    }
}

export default Entity;