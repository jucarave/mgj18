import Matrix4 from 'engine/math/Matrix4';
import Vector3 from 'engine/math/Vector3';

class Camera {
    private _needsUpdate            : boolean;
    private _projection             : Matrix4;
    private _transformation         : Matrix4;
    private _position               : Vector3;
    private _target                 : Vector3;
    private _up                     : Vector3;

    constructor(projection: Matrix4) {
        this._projection = projection;
        this._transformation = Matrix4.createIdentity();
        this._position = new Vector3();
        this._target = new Vector3();
        this._up = new Vector3(0, 1, 0);
        this._needsUpdate = true;
    }

    public setPosition(x: number, y: number, z: number): Camera {
        this._position.set(x, y, z);

        this._needsUpdate = true;

        return this;
    }

    public setTarget(x: number, y: number, z: number): Camera {
        this._target.set(x, y, z);

        this._needsUpdate = true;

        return this;
    }

    public get transformation(): Matrix4 {
        if (!this.needsUpdate) {
            return this._transformation;
        }

        let f = this.forward,
            l = Vector3.cross(this._up, f).normalize(),
            u = Vector3.cross(f, l).normalize();

        let cp = this._position,
            x = -Vector3.dot(l, cp),
            y = -Vector3.dot(u, cp),
            z = -Vector3.dot(f, cp);

        Matrix4.set(
            this._transformation,
            l.x, u.x, f.x, 0,
            l.y, u.y, f.y, 0,
            l.z, u.z, f.z, 0,
            x,   y,   z, 1
        );
        
        this._needsUpdate = false;

        return this._transformation;
    }

    public get forward(): Vector3 {
        let cp = this._position,
            tp = this._target;

        return new Vector3(cp.x - tp.x, cp.y - tp.y, cp.z - tp.z);
    }

    public get projection(): Matrix4 {
        return this._projection;
    }

    public get position(): Vector3 {
        return this._position;
    }

    public get target(): Vector3 {
        return this._target;
    }

    public get needsUpdate(): boolean {
        return this._needsUpdate || this._position.needsUpdate || this._target.needsUpdate;
    }
}

export default Camera;