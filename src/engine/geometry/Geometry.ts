import Shader from 'engine/shaders/Shader';

const VERTICE_SIZE = 3;
const TEX_SIZE = 2;

class Geometry {
    private _gl                 : WebGLRenderingContext;
    private _vertices           : Array<number>;
    private _textureCoords      : Array<number>;
    private _triangles          : Array<number>;
    private _vertexBuffer       : WebGLBuffer;
    private _texBuffer          : WebGLBuffer;
    private _indexBuffer        : WebGLBuffer;
    private _indexLength        : number;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
        this._vertices = [];
        this._triangles = [];
        this._textureCoords = [];
    }

    public addVertice(x: number, y: number, z: number): void {
        this._vertices.push(x, y, z);
    }

    public addTextureCoord(x: number, y: number): void {
        this._textureCoords.push(x, y);
    }

    public addTriangle(vertice1: number, vertice2: number, vertice3: number): void {
        if (!this._vertices[vertice1 * VERTICE_SIZE] === undefined) { throw new Error("Couldn't vertice [" + vertice1 + "]"); }
        if (!this._vertices[vertice2 * VERTICE_SIZE] === undefined) { throw new Error("Couldn't vertice [" + vertice2 + "]"); }
        if (!this._vertices[vertice3 * VERTICE_SIZE] === undefined) { throw new Error("Couldn't vertice [" + vertice3 + "]"); }

        this._triangles.push(vertice1, vertice2, vertice3);
    }

    public build(): void {
        let gl = this._gl;

        this._vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW);

        this._texBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._texBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._textureCoords), gl.STATIC_DRAW);

        this._indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._triangles), gl.STATIC_DRAW);

        this._indexLength = this._triangles.length;

        this._vertices = null;
        this._triangles = null;
    }

    public render(shader: Shader): void {
        let gl = this._gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.vertexAttribPointer(shader.attributes["aVertexPosition"], VERTICE_SIZE, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._texBuffer);
        gl.vertexAttribPointer(shader.attributes["aTextureCoords"], TEX_SIZE, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.drawElements(gl.TRIANGLES, this._indexLength, gl.UNSIGNED_SHORT, 0);
    }

    public get gl(): WebGLRenderingContext {
        return this._gl;
    }

    public get trianglesLength(): number {
        return this._triangles.length / 3;
    }
}

export default Geometry;