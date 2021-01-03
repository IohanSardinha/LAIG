/*
*Stores the a sequence of game moves (MyGameMoveobjects):
Methods:
	• Adda game move
	• Manage undo
	• Feeds move replay
*/

class MyGameSequence{
	contructor() {
		this.moveStack;
		this.currentMove = null;
	}

	addMove(move)
	{
		this.moveStack.push(move);
	}
	
	undoMove() {
		return this.moveStack.pop();
	}

	getMoves()
	{
		return this.moveStack;
	}

	showAnimation(time){


		if(this.currentMove == null){
			this.gameBoard.resetPosition();
			this.currentMove = 0;
		}
		
		if(this.currentMove >= this.moveStack.length)
		{
			this.currentMove = null;
			return false;
		}

		this.currPlayer = this.currPlayer || 'r';
		if(this.moveStack[this.currentMove].movedPiece instanceof MyPiece)
			this.currPlayer = this.moveStack[this.currentMove].movedPiece.color;

		if(!this.moveStack[this.currentMove].animate(time, this.currPlayer , this.gameBoard))
		{
			this.moveStack[this.currentMove].movedPiece.tile = this.moveStack[this.currentMove].destinationTile;
			this.moveStack[this.currentMove].animationStarted = false;
			if(this.moveStack[this.currentMove].movedPiece instanceof MyPiece)
			{
				this.moveStack[this.currentMove].movedPiece.animator = null;
				this.moveStack[this.currentMove].destinationTile.piece = this.moveStack[this.currentMove].movedPiece;
				this.moveStack[this.currentMove].originTile.piece = null;
			}
			else{
				this.gameBoard.dropStone(this.currPlayer, this.moveStack[this.currentMove].destinationTile);
				console.log(this.gameBoard.red_stones);
				console.log(this.gameBoard.yellow_stones);
			}
			this.currentMove++;
		}

		return true;
	}
}