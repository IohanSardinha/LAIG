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

		if(!this.moveStack[this.currentMove].animate(time))
			this.currentMove++;

		return true;
	}
}