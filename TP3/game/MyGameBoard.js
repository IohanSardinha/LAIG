/*
* Stores the set of tiles that composes the entire game board
Methods:
	* Create a gameboard instance
	* Add piece to a given tile
	* Remove piece from a given tile
	* Get piece on a given tile
	* Get tile given a piece
	* Get tile by board coordinate system (A..H;1..8 on chess or 0..7;0..7)
	* Move piece (piece, starting tile, destination tile)
	* Display the gameboard (render). Calls display of tiles and of pieces.
*/
class MyGameBoard{
	contructor(){
		this.tiles = [];
		this.pieces = [];
		this.gameState;
	}

	getLine(stringID){
		return stringID.toLowerCase().charCodeAt(0) - 96;
	}

	getColumn(stringID){
		return parseInt(stringID[1]);
	}

	setTiles(tiles){
		for(let id in tiles){
			tiles[id].gameboard = this;
		}
		this.tiles = tiles;
	}

	setPieces(pieces){
		this.pieces = pieces;
		for(let piece of this.pieces){
			this.tiles[piece.tile].piece = piece;
			piece.tile = this.tiles[piece.tile];
		}
	}

	showValidMoves(validMoves){
		this.unselectAllTiles();
		for(let validMove of validMoves){
			let id = String.fromCharCode(64+validMove[0])+validMove[1];
			this.tiles[id].select();
		}
	}

	unselectAllTiles(){
		for(let id in this.tiles){
			this.tiles[id].select(false);
		}
	}

	getTile(stringPosition)
	{
		if(this.tiles[stringPosition] != -1)
			return this.tiles[stringPosition];
		return false;
	}


}