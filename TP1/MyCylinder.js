/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
   //<leaf type="cylinder" height="1" topRadius="1" bottomRadius="1" stacks="1" slices="10"/>
    constructor(scene, height, topRadius, bottomRadius, stacks, slices) {
        super(scene);
        this.height = height;
        this.topRadius = topRadius;
        this.bottomRadius = bottomRadius;
        this.stacks = stacks;
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var alphaRad = (this.bottomRadius - this.topRadius)/this.stacks;

        for (let i = 0; i <= this.slices; i++) {
            this.vertices.push(Math.cos(ang), 0.5, -Math.sin(ang));
            this.vertices.push(Math.cos(ang), -0.5, -Math.sin(ang));
            if (i !== this.slices) {
                this.indices.push(i * 2, i * 2 + 1, i * 2 + 2);
                this.indices.push(i * 2 + 3, i * 2 + 2, i * 2 + 1);
            }
            this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
            this.normals.push(Math.cos(ang), 0, -Math.sin(ang));
            this.texCoords.push(i / this.slices, 0);
            this.texCoords.push(i / this.slices, 1);
            ang += alphaAng;
        }

        this.vertices.push(0, 0.7, 0);
        this.normals.push(0, 0.7, 0);
        this.vertices.push(0, -0.7, 0);
        this.normals.push(0, -0.7, 0);

        for (let i = 0; i < this.slices; i++) {
            this.indices.push(2 * i, 2 * i + 2, this.vertices.length / 3 - 2);
            this.indices.push(2 * i + 1, this.vertices.length / 3 - 1, 2 * i + 3);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}


