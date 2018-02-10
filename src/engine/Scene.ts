import Entity from 'engine/entities/Entity';
import Camera from 'engine/Camera';
import Renderer from 'engine/Renderer';
import Shader from 'engine/shaders/Shader';

interface Layers {
    [index: string]         : Array<Entity>;
}

abstract class Scene {
    protected _layers       : Layers;
    protected _camera       : Camera;
    protected _renderer     : Renderer;

    constructor(renderer: Renderer) {
        this._renderer = renderer;

        this._layers = {};
    }

    protected _addLayer(name: string): void {
        if (this._layers[name]) { throw new Error("Layer [" + name + "] already exists!"); }

        this._layers[name] = [];
    }

    public addInstance(entity: Entity, layer: string): void {
        if (!this._layers[layer]) { throw new Error("Layer [" + layer + "] not found!"); }

        this._layers[layer].push(entity);

        entity.scene = this;
    }

    public start(): void {
        for (let name in this._layers) {
            let layer = this._layers[name];

            for (let i=0,entity;entity=layer[i];i++) {
                entity.start();
            }
        }
    }

    public loop(): void {
        let gl = this._renderer.gl,
            lastShader: Shader = null;

        for (let name in this._layers) {
            let layer = this._layers[name];

            for (let i=0,entity;entity=layer[i];i++) {
                entity.update();
            }

            for (let i=0,entity;entity=layer[i];i++) {
                let shader = entity.material.shader
                if (shader !== lastShader) {
                    gl.uniformMatrix4fv(shader.uniforms["uProjection"], false, this._camera.projection.data);
                    gl.uniformMatrix4fv(shader.uniforms["uView"], false, this._camera.transformation.data);

                    lastShader = shader;
                }

                entity.render();
            }
        }
    }

    public get camera(): Camera {
        return this._camera;
    }
}

export default Scene;