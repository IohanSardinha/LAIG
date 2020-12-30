/*
Manages the entire game:
	• Load of new scenes
	• Manage gameplay (game states)
	• Manages undo•Manages movie play
	• Manage object selection
*/

class MyGameOrchestrator
{
	constructor(scene){

		this.scene = scene;
		this.gameSequence= new MyGameSequence();
		this.animator= new MyAnimator();
		this.gameboard= new MyGameBoard();
		this.theme= new MySceneGraph('menu.xml', scene);
		this.prolog= new MyPrologInterface();		
	
        this.prolog.testConnection();

		this.displayMenu = false;
        //this.startGame(1, 1, 'Player vs. Player');
		this.initGame = false;
        this.level = 1;
        this.modes = ['Player vs. Player', 'Player vs. CPU', 'CPU vs. CPU'];
        this.mode = 'Player vs. CPU';
        this.menu = new Menu(this,scene, this.level, this.mode);

        this.state = 'start';
	}

	startGame(ambient, level, game_mode) {
        this.level = level;
        this.mode = game_mode;

        let filename;
        switch (ambient) {
            case 1:
                filename = "jinli.xml";
                break;
            case 2:
                filename = "jinli.xml";
                break;
            default:
                filename = "menu.xml";
                break;
        }
        this.scene.sceneInitiated = false;
        this.displayMenu = false;
        
        this.theme = new MySceneGraph(filename, this.scene);
    }

	update(time) {
        switch(this.state){
            case 'start':
                this.prolog.testConnection();
                this.state = 'testing connection';
                break;
            
            case 'testing connection':
                if(this.prolog.connectionStablished === true)
                    this.state = 'connected';
                if(this.prolog.connectionStablished === false)
                    this.state = 'connection error';
                break;
            
            case 'connection error':
                alert('Could not connect to server');
                this.state = 'broken';
                break;

            case 'connected':
                this.prolog.sendInitial();
                this.state = 'waiting initial';
                break;

            case 'waiting initial':
                if(this.prolog.requestReady)
                    this.state = 'initial parsed';
                break;

            case 'initial parsed':
                this.displayMenu = true;
                break;
        }

		if (!this.displayMenu) {
            if (this.sceneInited) {
                if (!this.initGame) {
                    let mode;
                    for (let i = 0; i < this.modes.length; i++) {
                        if (this.modes[i] === this.mode) {
                            mode = i + 1;
                            break;
                        }
                    }
                    this.initGame = true;
                }

                this.checkKeys();
                this.theme.update(t);

            }
        }
	}

	display() {
		//...

		this.theme.displayScene();
        if (this.displayMenu) {
            this.menu.display();
        }
        else
        {
    	    this.managePick(this.scene.pickMode, this.scene.pickResults);
        }
		//this.gameboard.display();
		//this.animator.display();
		//...
	}

	logPicking() {
        if (this.scene.pickMode == false) {
            if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
                console.log(this.scene.pickResults);
                for (var i = 0; i < this.scene.pickResults.length; i++) {
                    var obj = this.scene.pickResults[i][0];
                    if (obj) {
                        var customId = this.scene.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
            }
        }
    }

	managePick(mode, results) {
		if (mode == false /* && some other game conditions */)
			if (results != null && results.length> 0)  // any results? 
			{
				for (var i=0; i< results.length; i++) 
				{
					var obj= results[i][0]; // get object from result
						if (obj)  // exists? 
						{
							var uniqueId= results[i][1] // get idt
							this.onObjectSelected(obj, uniqueId);
						}
				} 

				// clear results 

				results.splice(0, results.length);
			}
	}

	onObjectSelected(obj, id){
		if(obj instanceof MyPiece){
			// do something with id knowing it is a piece
		}
		else if(obj instanceof MyTile){
            obj.select();
			// do something with id knowing it is a tile
		}
		else {
			// error ? 
		}
	}

}