import { ShaderStruct } from 'engine/shaders/ShaderStruct';

let SpriteShader: ShaderStruct = {
    vertexShader: `
        precision mediump float;

        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoords;

        uniform mat4 uProjection;
        uniform mat4 uPosition;
        uniform mat4 uView;
        uniform vec2 uAnchor;
        uniform vec2 uScale;

        varying vec2 vTextureCoords;

        void main(void) {
            vec3 position = aVertexPosition;
            position.xy -= uAnchor;

            position.xy *= uScale;
            position.y *= -1.0;

            gl_Position = uProjection * uPosition * uView * vec4(position, 1.0);

            vTextureCoords = aTextureCoords;
        }
    `,

    fragmentShader: `
        precision mediump float;

        uniform sampler2D uTexture;
        uniform vec4 uUVs;

        varying vec2 vTextureCoords;

        void main(void) {
            vec2 coords = vTextureCoords * uUVs.zw + uUVs.xy;

            gl_FragColor = texture2D(uTexture, coords);
        }
    `
};

export default SpriteShader;