import Shader from 'engine/shaders/Shader';
import Renderer from '../Renderer';

abstract class Material {
    protected _shader           : Shader;
    protected _gl               : WebGLRenderingContext;
    protected _renderer         : Renderer;

    constructor(renderer: Renderer, shader: Shader) {
        this._renderer = renderer;
        this._gl = renderer.gl;
        this._shader = shader;
    }

    public abstract render(): void;

    public abstract clone(): Material;

    public get isReady(): boolean {
        return true;
    }

    public get shader(): Shader {
        return this._shader;
    }
}

export default Material;