class MyGameState{
	constructor(GameStateArray){
		this.GameStateArray = GameStateArray;
		this.boardMatrix = GameStateArray[0];
		this.stones = GameStateArray[1];
		this.scores = GameStateArray[2];
		console.log(this.toString());
	}


	toString(){
		return JSON.stringify(this.GameStateArray).replaceAll('"','');
	}

	getTile(i,j){
		return this.boardMatrix[i][j];
	}

	getTile(stringPosition){
		let i = stringPosition.toLowerCase().charCodeAt(0);
		let j = parseInt(stringPosition[1]);

		return this.boardMatrix[i][j];
	}

	getScore(player){
		if(player == 'r')
			return this.scores[0];
		return this.scores[1];
	}

	getStones(player){
		if(player == 'r')
			return this.stones[0];
		return this.stones[1];	
	}
}