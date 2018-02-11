import Texture from 'engine/Texture';
import Material from 'engine/materials/Material';
import SpriteMaterial from 'engine/materials/SpriteMaterial';
import Renderer from 'engine/Renderer';
import Geometry from 'engine/geometry/Geometry';

export default {
    _textCount: false,
    renderer: null,
    materials: {
        FIREMAN: <Material>null,
        HOUSE: <Material>null,
        UI: <Material>null
    },
    geometries: {},
    images: [
        "img/fireman.png",
        "img/houseTiles.png",
        "img/ui.png"
    ],

    init(renderer: Renderer): void {
        this.renderer = renderer;

        let fireManTexture = new Texture(this.renderer.gl, this.images[0], () => {
            this._initFireman(fireManTexture);
            this._textCount += 1;
        });

        let houseTexture = new Texture(this.renderer.gl, this.images[1], () => {
            this._initHouse(houseTexture);
            this._textCount += 1;
        });

        let uiTexture = new Texture(this.renderer.gl, this.images[2], () => {
            this._initUI(uiTexture);
            this._textCount += 1;
        });
    },

    _initFireman(texture: Texture): void {
        let mat = new SpriteMaterial(this.renderer, texture);
        
        mat.createAnimation("stand", 0);
        mat.setAnimationAnchor("stand", 16, 32);
        mat.addAnimationFrame("stand", 0, 0, 32, 32);

        mat.createAnimation("walk", 1 / 6);
        mat.setAnimationAnchor("walk", 16, 32);
        
        for (let i=0;i<6;i++) {
            mat.addAnimationFrame("walk", 32+32*i, 0, 32, 32);
        }

        mat.playAnimation("stand");

        this.materials.FIREMAN = mat;
    },

    _initHouse(texture: Texture): void {
        let mat = new SpriteMaterial(this.renderer, texture);

        // LIVING ROOM
        mat.createAnimation("floor", 0).addFrame(0, 0, 16, 16);
        mat.createAnimation("floorWall", 0).addFrame(16, 48, 16, 16);
        mat.createAnimation("wall", 0).addFrame(16, 32, 16, 16);
        mat.createAnimation("wallCeil", 0).addFrame(16, 16, 16, 16);
        mat.createAnimation("ceil", 0).addFrame(16, 0, 16, 16);
        
        mat.createAnimation("windowTop", 0).addFrame(0, 16, 16, 16);
        mat.createAnimation("windowBottom", 0).addFrame(0, 32, 16, 16);

        mat.createAnimation("paint1", 0).addFrame(32, 0, 16, 16);

        mat.createAnimation("paint2Top", 0).addFrame(32, 16, 16, 16);
        mat.createAnimation("paint2Bottom", 0).addFrame(32, 32, 16, 16);

        mat.createAnimation("couch", 0).addFrame(0, 64, 64, 32);
        mat.createAnimation("table", 0).addFrame(48, 32, 48, 32);
        mat.createAnimation("tv", 0).addFrame(48, 0, 32, 32);

        this.materials.HOUSE = mat;
    },

    _initUI(texture: Texture): void {
        let mat = new SpriteMaterial(this.renderer, texture);

        mat.createAnimation("actionButton", 0).addFrame(0, 0, 12, 12).anchor = [6, 6];
        mat.createAnimation("backgroundPanel", 0).addFrame(16, 0, 96, 64).anchor = [48, 32];

        mat.createAnimation("tv", 0).addFrame(0, 64, 80, 48).addFrame(80, 64, 80, 48).anchor = [40, 24];

        this.materials.UI = mat;
    },

    getGeometry(material: Material): Geometry {
        let mat = <SpriteMaterial> material;
        if (!mat.getCurrentAnimation) { throw new Error("Get geometry requires SpriteMaterial object"); }

        let animation = mat.getCurrentAnimation(),
            w, h;

        if (animation) {
            w = animation.width;
            h = animation.height;
        } else {
            w = mat.texture.width;
            h = mat.texture.height;
        }
            
        let key = w + "_" + h;

        if (this.geometries[key]) {
            return this.geometries[key];
        }

        let geo: Geometry = new Geometry(this.renderer.gl);
        geo.addVertice( 0.0,   h, 0.0);
        geo.addVertice(   w,   h, 0.0);
        geo.addVertice(   w, 0.0, 0.0);
        geo.addVertice( 0.0, 0.0, 0.0);

        geo.addTextureCoord(0, 1);
        geo.addTextureCoord(1, 1);
        geo.addTextureCoord(1, 0);
        geo.addTextureCoord(0, 0);

        geo.addTriangle(0, 1, 2);
        geo.addTriangle(0, 2, 3);

        geo.build();

        this.geometries[key] = geo;

        return geo;
    },

    get isReady(): boolean {
        return this._textCount == this.images.length;
    }
};