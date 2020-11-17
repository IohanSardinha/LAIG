/** Represents a plane with nrDivs divisions along both axis, with center at (0,0) */
class MyPlane extends CGFobject{
	constructor(scene, nPartsU, nPartsV) {
		super(scene);
		
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		
		this.uStep = 1.0 / nPartsU;
		this.vStep = 1.0 / nPartsV;

		this.initBuffers();
	}
	initBuffers() {
		// Generate vertices, normals, and texCoords
		this.vertices = [];
		this.normals = [];
		this.texCoords = [];
		var zCoord = -0.5;
		for (var j = 0; j <= this.nPartsV; j++) {
			var xCoord = -0.5;
			for (var i = 0; i <= this.nPartsU; i++) {
				this.vertices.push(xCoord, 0, zCoord );
				this.normals.push(0, 1, 0);
				this.texCoords.push(0 + i * this.uStep, 0 + j * this.vStep);
				xCoord += this.uStep;
			}
			zCoord += this.vStep;
		}

		// Generating indices
		this.indices = [];

		let ind = 0;
		for(let i = 0; i < this.nPartsV; i++)
		{
			for(let j = 0; j <= this.nPartsU; j++)
			{
				this.indices.push(ind);
				this.indices.push(ind+1+this.nPartsU);
				ind++;
			}
			if(i < this.nPartsV -1)
			{
				this.indices.push(ind+this.nPartsU);
				this.indices.push(ind);
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
		this.initGLBuffers();
	}

	setFillMode() { 
		this.primitiveType=this.scene.gl.TRIANGLE_STRIP;
	}

	setLineMode() 
	{ 
		this.primitiveType=this.scene.gl.LINES;
	};

}


