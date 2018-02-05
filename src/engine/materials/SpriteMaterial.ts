import Material from 'engine/materials/Material';
import Renderer from 'engine/Renderer';
import Texture from 'engine/Texture';

class Animation {
    private _frames                 : Array<Array<number>>;

    public speed                    : number;
    public anchor                   : Array<number>;
    public frameIndex               : number;
    public readonly name            : string;

    constructor(name: string, speed: number) {
        this.name = name;
        this.speed = speed;
        this.frameIndex = 0;
        this._frames = [];
        this.anchor = [0, 0];
    }

    public addFrame(x: number, y: number, w: number, h: number): void {
        let frame = [ x, y, w, h ];

        this._frames.push(frame);
    }

    public getFrame(index: number): Array<number> {
        return this._frames[index << 0];
    }

    public update(): Array<number> {
        this.frameIndex += this.speed;

        if (this.frameIndex >= this._frames.length) {
            this.frameIndex = 0;
        }

        return this.getFrame(this.frameIndex);
    }
}

interface AnimationsMap {
    [index: string]: Animation
}

class SpriteMaterial extends Material {
    private _texture            : Texture;
    private _animations         : AnimationsMap;
    private _currentAnimation   : Animation;
    private _uvs                : Array<number>;

    constructor(renderer: Renderer, texture: Texture) {
        super(renderer.gl, renderer.getShader("SPRITE"));

        this._texture = texture;
        this._animations = {};
        this._uvs = [0, 0, 1, 1];
        this._currentAnimation = null;
    }

    public render(): void {
        let gl = this._texture.gl;

        if (this._currentAnimation) {
            this._uvs = this._currentAnimation.update();
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this._texture.texture);
        gl.uniform1i(this._shader.uniforms["uTexture"], 0);

        gl.uniform4fv(this._shader.uniforms["uUVs"], this._uvs);

        gl.uniform2fv(this._shader.uniforms["uAnchor"], this._currentAnimation.anchor);
    }

    public createAnimation(name: string, speed: number = 1.0): Animation {
        let animation = new Animation(name, speed);

        this._animations[name] = animation;

        if (this._currentAnimation == null) {
            this._currentAnimation = animation;
        }

        return animation;
    }

    public setAnimationAnchor(animationName: string, x: number, y: number) {
        if (!this._animations[animationName]) { throw new Error("Animation [" + animationName + "] is not defined"); }

        this._animations[animationName].anchor = [x, y];
    }

    public addAnimationFrame(animationName: string, x: number, y: number, w: number, h: number): void {
        if (!this._animations[animationName]) { throw new Error("Animation [" + animationName + "] is not defined"); }

        this._animations[animationName].addFrame(x, y, w, h);
    }

    public playAnimation(animationName: string): void {
        if (!this._animations[animationName]) { throw new Error("Animation [" + animationName + "] is not defined"); }

        this._currentAnimation = this._animations[animationName];

        this._currentAnimation.frameIndex = 0;
        this._uvs = this._currentAnimation.getFrame(0);
    }

    public isReady(): boolean {
        return this._texture.isReady;
    }

    public get texture(): Texture {
        return this._texture;
    }
}

export default SpriteMaterial;