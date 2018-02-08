import Entity from 'engine/entities/Entity';
import Renderer from 'engine/Renderer';
import Utils from 'engine/Utils';
import Geometry from 'engine/geometry/Geometry';
import SpriteMaterial from 'engine/materials/SpriteMaterial';
import Texture from 'engine/Texture';

class Text extends Entity {
    private _renderer           : Renderer;
    private _text               : string;
    private _font               : string;
    private _size               : number;

    constructor(renderer: Renderer, text: string, font: string, size: number) {
        super(null, null);

        this._renderer = renderer;
        this._text = text;
        this._font = font;
        this._size = size;

        this._printText();
    }

    private _setCtxProperties(ctx: CanvasRenderingContext2D): void {
        ctx.font = this._size + "px " + this._font;
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
    }

    private _createGeometry(textSize: TextMetrics, width: number, height: number): Geometry {
        let ret = new Geometry(this._renderer.gl);

        let w = textSize.width,
            h = this._size;

        ret.addVertice(0.0, 0.0, 0.0);
        ret.addVertice(0.0,   h, 0.0);
        ret.addVertice(  w,   h, 0.0);
        ret.addVertice(  w, 0.0, 0.0);

        w = (textSize.width) / width;
        h = (this._size) / height;

        ret.addTextureCoord(0.0, 0.0);
        ret.addTextureCoord(0.0,   h);
        ret.addTextureCoord(  w,   h);
        ret.addTextureCoord(  w, 0.0);

        ret.addTriangle(0, 1, 2);
        ret.addTriangle(0, 2, 3);

        ret.build();

        return ret;
    }

    private _printText(): void {
        let canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d", {alpha: false});

        this._setCtxProperties(ctx);

        let size = ctx.measureText(this._text),
            width = Utils.roundUpPowerOf2(size.width),
            height = Utils.roundUpPowerOf2(this._size);

        canvas.width = width;
        canvas.height = height;

        this._setCtxProperties(ctx);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(this._text, 0, this._size);

        let geo = this._createGeometry(size, width, height),
            texture = new Texture(this._renderer.gl, canvas),
            mat = new SpriteMaterial(this._renderer, texture);

        this._geometry = geo;
        this._material = mat;
    }
}

export default Text;