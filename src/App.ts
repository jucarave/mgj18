import Renderer from 'engine/Renderer';
import Matrix4 from 'engine/math/Matrix4';
import Geometry from 'engine/geometry/Geometry';
import Entity from 'engine/entities/Entity';
import Camera from 'engine/Camera';
import SpriteMaterial from 'engine/materials/SpriteMaterial';
import Texture from 'engine/Texture';

class App {
    private _renderer           : Renderer;

    constructor() {
        this._renderer = new Renderer(854, 480, document.getElementById("divGame"));

        this._drawTriangle();
    }

    private _drawTriangle(): void {
        // Create triangle
        let geo: Geometry = new Geometry(this._renderer.gl);
        geo.addVertice( 0.0, 32.0, 0.0);
        geo.addVertice(16.0, 32.0, 0.0);
        geo.addVertice(16.0,  0.0, 0.0);
        geo.addVertice( 0.0,  0.0, 0.0);

        geo.addTextureCoord(0, 1);
        geo.addTextureCoord(1, 1);
        geo.addTextureCoord(1, 0);
        geo.addTextureCoord(0, 0);

        geo.addTriangle(0, 1, 2);
        geo.addTriangle(0, 2, 3);

        geo.build();

        let texture = new Texture(this._renderer.gl, "img/fireman.png");

        let mat = new SpriteMaterial(this._renderer, texture);
        
        mat.createAnimation("stand", 0.1);
        mat.setAnimationAnchor("stand", 8, 32);
        mat.addAnimationFrame("stand", 0, 0, 16/32, 32/32);
        mat.addAnimationFrame("stand", 16/32, 0, 16/32, 32/32);
        mat.playAnimation("stand");

        let spr: Entity = new Entity(geo, mat);

        // Create camera
        let camera = new Camera(Matrix4.createOrtho(854/4, 480/4, 0.1, 1000));
        camera.setPosition(0, 0, 3);
        camera.setTarget(0, 0, 0);

        this._loop(spr, camera);
    }

    private _loop(entity: Entity, camera: Camera): void {
        let gl = this._renderer.gl,
            shader = entity.material.shader;

        // Draw triangle
        this._renderer.clear();

        gl.uniformMatrix4fv(shader.uniforms["uProjection"], false, camera.projection.data);
        gl.uniformMatrix4fv(shader.uniforms["uView"], false, camera.transformation.data); 

        entity.render();

        requestAnimationFrame(() => {
            this._loop(entity, camera);
        });
    }
}

window.onload = () => {
    new App();
};