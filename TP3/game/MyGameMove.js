/*
* Stores a game move
Has:
	* Pointer to movedpiece(MyPiece)
	* Pointer to origintile (MyTile)
	* Pointer to destinationtile (MyTile)
	* Pointerto destinationtile (MyTile)
Methods:
	* Animate
*/
class MyGameMove extends CGFobject {

	constructor(scene,movedPiece, originTile, DestinationTile) {
		super(scene);
		this.movedPiece = movedPiece;

		this.originTile = originTile;

		this.DestinationTile = DestinationTile;

	}

	animate() {
	}

}


