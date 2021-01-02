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
}