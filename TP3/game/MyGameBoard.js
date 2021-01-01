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
		this.red_stones = [];
		this.yellow_stones = [];
		this.gameState;
	}

	dropStone(currPlayer, tile){
		this.unselectAllTiles();

		if(currPlayer == 'r')
		{
			this.red_stones.pop().tile = tile;
		}
		else{
			this.yellow_stones.pop().tile = tile;
		}
	}

	getTile(ID){
		return this.tiles[ID];
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
			if (this.tiles[piece.tile])
			{
				this.tiles[piece.tile].piece = piece 
				piece.tile = this.tiles[piece.tile];
			}
		}
	}

	selectTiles(positions){
		let print = '';
		for(let position of positions){
			let id = String.fromCharCode(64+position[1])+(8-position[0]);
			this.tiles[id].select();
			print += position + ' -> '+ id + ', ';
		}
		console.log(print);
	}

	movePiece(fromTile, toTile){
		fromTile.piece.tile = toTile;
		toTile.piece = fromTile.piece;
		fromTile.piece = null;
		this.unselectAllTiles();
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

	getScore(){
		return this.gameState['scores'];
	}


}