/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - Radius of the torus
 * @param outer - Radius inside of the torus
 * @param slices - number of divisions around the inner radius
 * @param loops - number of divisions around the outer radius
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
        super(scene);
		this.inner = inner;
		this.outer = outer;
        this.slices = slices;
        this.loops = loops;

		this.initBuffers();
	}
	
	initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.theta = (2 * Math.PI) / this.slices;
        this.fi = (2 * Math.PI) / this.loops;

        var tex_s = 1 / this.slices;
        var tex_t = 1 / this.loops;

        var i;
        var j;
        for (i = 0; i <= this.loops; i++) {
            for (j = 0; j <= this.slices; j++) {
                this.vertices.push((this.outer + this.inner * Math.cos(this.theta * j)) * Math.cos(this.fi * i), (this.outer + this.inner * Math.cos(this.theta * j)) * Math.sin(this.fi * i), this.inner * Math.sin(this.theta * j));
                this.normals.push(Math.cos(this.theta * j) * Math.cos(this.fi * i), Math.cos(this.theta * j) * Math.sin(this.fi * i), Math.sin(this.theta * j));
            }
        }

        for (i = 0; i < this.loops; i++) {
            for (j = 0; j < this.slices; j++) {
                this.indices.push((i * (this.slices + 1)) + j, (i * (this.slices + 1)) + j + this.slices + 1, (i * (this.slices + 1)) + j + this.slices + 2);
                this.indices.push((i * (this.slices + 1)) + j, (i * (this.slices + 1)) + j + this.slices + 2, (i * (this.slices + 1)) + j + 1);                
            }
        }

        for (i = 0; i < this.loops; i++) {
            for (j = 0; j < this.slices; j++) {
                this.texCoords.push(tex_s * j, 1 - tex_t * i);
            }
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}