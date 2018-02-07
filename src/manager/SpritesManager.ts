import Texture from 'engine/Texture';
import Material from 'engine/materials/Material';
import SpriteMaterial from 'engine/materials/SpriteMaterial';
import Renderer from 'engine/Renderer';
import Geometry from 'engine/geometry/Geometry';

export default {
    isReady: false,
    texture: null,
    renderer: null,
    materials: {
        FIREMAN: null
    },
    geometries: {},

    init(renderer: Renderer): void {
        this.renderer = renderer;

        this.texture = new Texture(this.renderer.gl, "img/fireman.png", () => {
            this._initFireman();

            this.isReady = true;
        });
    },

    _initFireman(): void {
        let mat = new SpriteMaterial(this.renderer, this.texture);
        
        mat.createAnimation("stand", 0);
        mat.setAnimationAnchor("stand", 16, 32);
        mat.addAnimationFrame("stand", 0, 0, 32, 32);

        mat.createAnimation("walk", 1 / 6);
        mat.setAnimationAnchor("walk", 16, 32);
        
        for (let i=0;i<6;i++) {
            mat.addAnimationFrame("walk", 32+32*i, 0, 32, 32);
        }

        this.materials.FIREMAN = mat;
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
    }
};