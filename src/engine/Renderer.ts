import Shader from 'engine/shaders/Shader';
import { ShaderMap } from 'engine/shaders/ShaderStruct';
import SpriteShader from 'engine/shaders/SpriteShader';

export type ShadersNames = 'SPRITE';

class Renderer {
    private _canvas                 : HTMLCanvasElement;
    private _gl                     : WebGLRenderingContext;
    private _shaders                : ShaderMap;

    public readonly _width          : number;
    public readonly _height         : number;

    constructor(width: number, height: number, container?: HTMLElement) {
        this._width = width;
        this._height = height;

        this._createCanvas(container);
        this._initGL();
        this._initShaders();
    }

    private _createCanvas(container?: HTMLElement): void {
        let canvas = document.createElement("canvas");

        canvas.width = this._width;
        canvas.height = this._height;

        if (container) {
            container.appendChild(canvas);
        }

        this._canvas = canvas;
    }

    private _initGL(): void {
        let gl = this._canvas.getContext("webgl");

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0, 0, this._width, this._height);
        gl.clearColor(0.5, 0.5, 0.5, 1);

        this._gl = gl;
    }

    private _initShaders(): void {
        let gl = this.gl;

        this._shaders = {};

        this._shaders.SPRITE = new Shader(gl, SpriteShader);

        this._shaders.SPRITE.useProgram();
    }

    public getShader(shaderName: ShadersNames): Shader {
        return this._shaders[shaderName];
    }

    public clear(): void {
        let gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    public get gl(): WebGLRenderingContext {
        return this._gl;
    }
}

export default Renderer;