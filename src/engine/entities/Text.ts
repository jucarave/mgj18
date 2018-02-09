import Entity from 'engine/entities/Entity';
import Renderer from 'engine/Renderer';
import Utils from 'engine/Utils';
import Geometry from 'engine/geometry/Geometry';
import SpriteMaterial from 'engine/materials/SpriteMaterial';
import Texture from 'engine/Texture';

type textHAlign = 'left' | 'center' | 'right';

interface TextOptions {
    size?: number;
    color?: string;
    font?: string;
    halign?: textHAlign
}

const DEFAULT_OPTIONS: TextOptions = {
    size: 120,
    color: '#FFFFFF',
    font: 'Helvetica',
    halign: 'left'
};

const TEXT_SCALE = 10;

class Text extends Entity {
    private _renderer           : Renderer;
    private _text               : string;
    private _options            : TextOptions;

    constructor(renderer: Renderer, text: string, options?: TextOptions) {
        super(null, null);

        this._renderer = renderer;
        this._text = text;
        this._options = this._mergeOptions(options);

        this._printText();
    }

    private _mergeOptions(options?: TextOptions): TextOptions {
        let ret: TextOptions = {
            size: (options && options.size !== undefined)? options.size : DEFAULT_OPTIONS.size,
            color: (options && options.color !== undefined)? options.color : DEFAULT_OPTIONS.color,
            font: (options && options.font !== undefined)? options.font : DEFAULT_OPTIONS.font,
            halign: (options && options.halign !== undefined)? options.halign : DEFAULT_OPTIONS.halign
        };

        return ret;
    }

    private _setCtxProperties(ctx: CanvasRenderingContext2D): void {
        ctx.font = this._options.size + "px " + this._options.font;
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
    }

    private _createGeometry(textSize: TextMetrics, width: number, height: number): Geometry {
        let ret = new Geometry(this._renderer.gl);

        let w = textSize.width / TEXT_SCALE,
            h = this._options.size / TEXT_SCALE;

        ret.addVertice(0.0, 0.0, 0.0);
        ret.addVertice(0.0,   h, 0.0);
        ret.addVertice(  w,   h, 0.0);
        ret.addVertice(  w, 0.0, 0.0);

        w = (textSize.width) / width;
        h = (this._options.size) / height;

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
            ctx = canvas.getContext("2d");

        this._setCtxProperties(ctx);

        let size = ctx.measureText(this._text),
            width = Utils.roundUpPowerOf2(size.width),
            height = Utils.roundUpPowerOf2(this._options.size);

        canvas.width = width;
        canvas.height = height;

        this._setCtxProperties(ctx);

        ctx.translate(0.5, 0.5);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = this._options.color;
        ctx.fillText(this._text, 0, this._options.size);
        ctx.restore();

        let geo = this._createGeometry(size, width, height),
            texture = new Texture(this._renderer.gl, canvas),
            mat = new SpriteMaterial(this._renderer, texture);

        if (this._options.halign == 'center') {
            mat.anchor[0] = size.width / TEXT_SCALE / 2;
        } else if (this._options.halign == 'right') {
            mat.anchor[0] = size.width / TEXT_SCALE;
        }

        this._geometry = geo;
        this._material = mat;
    }

    public set text(text: string) {
        this._text = text;
        this._printText();
    }
}

export default Text;