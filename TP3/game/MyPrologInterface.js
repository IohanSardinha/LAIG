class MyPrologInterface{

	sendeStartProlog()
	{

		let requestString = 'handshake';
		var requestPort = port || 8081
		var request = new XMLHttpRequest();

		request.onload = this.parseStartPrologReply;
		request.onerror = this.startPrologGameError;

		request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	}

	parseStartPrologReply(){
		
		if(this.status=== 400)
		{
			console.log("ERROR");
			return;
		}

		// theanswer here is: [Board,CurrentPlayer,WhiteScore,BlackScore]
		let responseArray= textStringToArray(this.responseText,true);
		// do somethingwithresponseArray[0];
		// do somethingwithresponseArray[1];
		// do somethingwithresponseArray[2];
		// do somethingwithresponseArray[3]; 
	}

	makeRequest()
	{
		// Get Parameter Values
		var requestString = document.querySelector("#query_field").value;				
		
		// Make Request
		getPrologRequest(requestString, handleReply);
	}
	
	//Handle the Reply
	handleReply(data){
		document.querySelector("#query_result").innerHTML=data.target.response;
	}

}