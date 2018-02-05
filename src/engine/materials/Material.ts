import Shader from 'engine/shaders/Shader';

abstract class Material {
    protected _shader           : Shader;
    protected _gl               : WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext, shader: Shader) {
        this._gl = gl;
        this._shader = shader;
    }

    public abstract render(): void;

    public isReady(): boolean {
        return true;
    }

    public get shader(): Shader {
        return this._shader;
    }
}

export default Material;