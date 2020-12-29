class MyPatch extends CGFnurbsObject {
	constructor(scene, nPartsU, nPartsV, degree1, degree2, controlvertexes) {

		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlvertexes);

		super(scene, nPartsU, nPartsV, nurbsSurface);
	}
}

