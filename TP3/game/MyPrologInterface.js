class MyPrologInterface{

	constructor(port){
		this.requestPort = port || 8081;
		this.connectionStablished = null;
		this.requestReady = false;
		this.parsedResult = null;
	}

	testConnection(){
		let requestString = 'handshake';
		var request = new XMLHttpRequest();

		request.onload = (data) => this.confirmConnection(data);
		request.onerror = () => this.connectionError();
		

		request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}

	confirmConnection(data){
		if(data.target.response == 'handshake')
				this.connectionStablished = true;
			else 
				this.connectionStablished = false;
	}

	connectionError(){
		this.connectionStablished = false;
	}

	sendInitial()
	{
		let requestString = 'initial';
		var request = new XMLHttpRequest();

		request.onload = (data) => this.parseGameStateReply(data);
		request.onerror = this.startPrologGameError;

		request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
		this.requestReady = false;
	}

	parseGameStateReply(data){
		 
		if(this.status=== 400)
		{
			console.log("ERROR");
			return;
		}

		// theanswer here is: [Board,CurrentPlayer,WhiteScore,BlackScore]
		let responseArray = this.textStringToArray(data.target.response);
		
		this.requestReady = true;
		this.parsedResult = new MyGameState(responseArray);
	}

	sendValidMoves(gameState,line,column){

		this.requestReady = false;
		this.parsedResult = null;
		let requestString = 'valid_moves('+gameState.toString()+','+(8-column)+','+(line)+')';
		console.log((8-column)+','+(line));
		var request = new XMLHttpRequest();

		request.onload = (data) => this.parseValidMoves(data);
		request.onerror = this.startPrologGameError;

		request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}

	parseValidMoves(data){
		if(this.status=== 400)
		{
			console.log("ERROR");
			return;
		}


		console.log(data.target.response);
		// theanswer here is: [Board,CurrentPlayer,WhiteScore,BlackScore]
		this.parsedResult = this.textStringToArray(data.target.response);
		
		this.requestReady = true;

	}

	sendMove(gameState,player,fromline,fromColumn, toLine, toColumn){
		this.requestReady = false;
		this.parsedResult = null;

		let move = JSON.stringify([player,8-fromColumn, fromline ,8-toColumn, toLine]).replaceAll('"','');

		let requestString = 'move('+gameState.toString()+','+move+')';
		var request = new XMLHttpRequest();

		request.onload = (data) => this.parseGameStateReply(data);
		request.onerror = this.startPrologGameError;

		request.open('GET', 'http://localhost:'+this.requestPort+'/'+requestString, true);

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}


	startPrologGameError(){

	}


	textStringToArray(textString){
		
		let returnArray = [];
		let topArray = returnArray;
		let arrayStack = [returnArray];
		let currStr = '';

		for(let char of textString)
		{
			if(char == '[')
			{
				let newArray = [];
				arrayStack.push(newArray);
				topArray.push(newArray);
				topArray = newArray;
			}
			else if(char == ','){
				if(isNaN(currStr))
					topArray.push(currStr);
				else if(currStr != '')
					topArray.push(parseInt(currStr));
				currStr = '';
			}
			else if(char == ']'){
				if(isNaN(currStr))
					topArray.push(currStr);
				else if(currStr != '')
					topArray.push(parseInt(currStr));
				currStr = '';

				arrayStack.pop();
				topArray = arrayStack[arrayStack.length - 1 ];
			}
			else if(char != ''){
				currStr += char;
			}
		}
		return returnArray[0];
	}
}