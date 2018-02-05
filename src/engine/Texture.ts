class Texture {
    private _image              : HTMLImageElement;
    private _texture            : WebGLTexture;
    private _width              : number;
    private _height             : number;
    private _gl                 : WebGLRenderingContext;
    private _isReady            : boolean;
    
    constructor(gl: WebGLRenderingContext, src: string, callback?: Function) {
        this._gl = gl;

        this._image = new Image();
        this._image.src = src;

        this._isReady = false;

        this._image.onload = () => {
            this._width = this._image.width;
            this._height = this._image.height;

            this._parseTexture();

            if (callback) {
                callback(this);
            }
        };
    }

    private _parseTexture(): void {
        let gl = this._gl;

        this._texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, this._texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this._isReady = true;
    }

    public get texture(): WebGLTexture {
        return this._texture;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get isReady(): boolean {
        return this._isReady;
    }

    public get gl(): WebGLRenderingContext {
        return this._gl;
    }
}

export default Texture;