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
        var radius = this.bottomRadius;
        var alphaRad = (this.topRadius - this.bottomRadius)/this.stacks;
        var height = 0;
        var aplhaHeight = this.height/this.stacks;


        for (let i = 0; i <= this.stacks; i++)
        {
            for (let j= 0; j< this.slices; j++) {
                this.vertices.push(Math.cos(ang)*radius, -Math.sin(ang)*radius, height);
                this.normals.push(Math.cos(ang),-Math.sin(ang),Math.atan(height));
                if(i !== this.stacks)
                {
                    this.indices.push(this.slices*i + j, this.slices*(i+1) + j, ((this.slices*i + j + 1)%this.slices)+(this.slices*i));
                    this.indices.push(this.slices*(i+1) + j, ((this.slices*(i+1) + j + 1)%this.slices)+(this.slices*(i+1)), ((this.slices*i + j + 1)%this.slices)+(this.slices*i));

                    this.indices.push(((this.slices*i + j + 1)%this.slices)+(this.slices*i), this.slices*(i+1) + j,this.slices*i + j );
                    this.indices.push( ((this.slices*i + j + 1)%this.slices)+(this.slices*i), ((this.slices*(i+1) + j + 1)%this.slices)+(this.slices*(i+1)),this.slices*(i+1) + j);
                }
                ang += alphaAng;
            }
            radius += alphaRad;
            height += aplhaHeight;
        }

        for (let i = 0; i <= this.stacks; i++)
            for (let j = 0; j <= this.slices; j++)
                this.texCoords.push((1/this.slices) * j, 1 - (1/this.stacks) * i);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}


