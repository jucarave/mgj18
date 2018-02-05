import Renderer from 'engine/Renderer';
import Matrix4 from 'engine/math/Matrix4';
import Entity from 'engine/entities/Entity';
import Camera from 'engine/Camera';
import SpritesManager from 'manager/SpritesManager';

class App {
    private _renderer           : Renderer;

    constructor() {
        this._renderer = new Renderer(854, 480, document.getElementById("divGame"));

        this._init();
    }

    private _init(): void {
        SpritesManager.init(this._renderer);

        var waitLoad = () => {
            if (SpritesManager.isReady) {
                this._drawScene();
            } else {
                requestAnimationFrame(() => { waitLoad(); });
            }
        };

        waitLoad();
    }

    private _drawScene(): void {
        let mat = SpritesManager.materials.FIREMAN;
        let spr: Entity = new Entity(SpritesManager.getGeometry(mat), mat);

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