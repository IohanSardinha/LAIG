/*
* Stores a game move
Has:
	* Pointer to moved piece(MyPiece)
	* Pointer to origin tile (MyTile)
	* Pointer to destination tile (MyTile)
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


