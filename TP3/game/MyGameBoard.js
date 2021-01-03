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
		this.placed_red_stones = [];
		this.yellow_stones = [];
		this.placed_yellow_stones = [];
		this.gameState;
	}

	dropStone(currPlayer, tile){
		if(currPlayer == 'r')
		{
			let stone = this.red_stones.pop();
			this.placed_red_stones.push(stone);
			stone.tile = tile;
		}
		else{
			let stone = this.yellow_stones.pop();
			this.placed_yellow_stones.push(stone);
			stone.tile = tile;
		}
	}

	setStoneAnimator(scene, initialMoment, currPlayer, dropTile){

        let start = {
            translation: {x:0, y:0, z:0},
            rotation:    {x:0, y:0, z:0},
            scale:       {x:1, y:1, z:1}
        }; 

        let stone_position = this.getStonePosition(currPlayer);
        
        let middle = {
            translation: {
                x: (stone_position[0] + ((dropTile.line-1)*3.85))/2, 
                y: 30, 
                z: (stone_position[2] - ((dropTile.column-1)*3.85))/2
            },
            rotation:    {x:0, y:0, z:0},
            scale:       {x:1, y:1, z:1}
        }; 


        let end = {
            translation: {
                x: stone_position[0] + ((dropTile.line-1)*3.85), 
                y: 0, 
                z: stone_position[2] - ((dropTile.column-1)*3.85)
            },
            rotation:    {x:0, y:0, z:0},
            scale:       {x:1, y:1, z:1}
        }; 

        let frames = [];
        frames[initialMoment] = start;
        frames[initialMoment+0.3] = middle;
        frames[initialMoment+0.6] = end;

        let animator = new KeyframeAnimator(frames, scene);

		if(currPlayer == 'r')
		{
			this.red_stones[this.red_stones.length - 1].animator = animator;
		}
		else{
			this.yellow_stones[this.yellow_stones.length - 1].animator = animator;
		}
	}

	animateStone(currPlayer, time){
		if(currPlayer == 'r')
		{
			this.red_stones[this.red_stones.length - 1].animator.update(time);
			return !this.red_stones[this.red_stones.length - 1].animator.ended;
		}
		this.yellow_stones[this.yellow_stones.length - 1].animator.update(time);
		return !this.yellow_stones[this.yellow_stones.length - 1].animator.ended;
	}

	getStonePosition(currPlayer){
		if(currPlayer == 'r')
			return [-(-4.9+(this.red_stones.length)*3), 0 ,-6];
		
		return [-(-4.9+(this.yellow_stones.length)*3), 0, 29];
	}

	getTileByPosition(line,column){
		let id = String.fromCharCode(64+column)+(8-line);
		return this.tiles[id];
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
		for(let position of positions){
			let id = String.fromCharCode(64+position[1])+(8-position[0]);
			this.tiles[id].select();
		}

	}

	movePiece(fromTile, toTile){
		fromTile.piece.tile = toTile;
		toTile.piece = fromTile.piece;
		fromTile.piece = null;
	}

	removeStone(currPlayer){
		if (currPlayer == 'y') {

			let stone = this.placed_yellow_stones.pop();
			stone.tile = null;
			this.yellow_stones.push(stone);
		}
		else {
			let stone = this.placed_red_stones.pop();
			stone.tile = null;
			this.red_stones.push(stone);
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

	getScore(){
		return this.gameState['scores'];
	}


}