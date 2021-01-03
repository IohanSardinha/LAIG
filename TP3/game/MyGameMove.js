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

	constructor(scene,movedPiece, originTile, destinationTile) {
		super(scene);

		this.movedPiece = movedPiece;

		this.originTile = originTile;

		this.destinationTile = destinationTile;
	
		this.animationStarted = false;
	}

	setAnimator(time,currPlayer, gameboard){
		if(this.movedPiece instanceof MyPiece)
		{
			this.movedPiece.setAnimator(this.destinationTile, this.originTile, time);
		}
		else{
			gameboard.setStoneAnimator(this.scene, time, currPlayer, this.destinationTile);
		}
		this.animationStarted = true;
	}

	animate(time, currPlayer, gameboard){
		if(!this.animationStarted)
			this.setAnimator(time, currPlayer, gameboard);
		if(this.movedPiece instanceof MyPiece){
			return this.movedPiece.animate(time);
		}
		else
			return gameboard.animateStone(currPlayer, time);
	}

}


