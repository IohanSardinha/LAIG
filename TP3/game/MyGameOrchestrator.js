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
	
		this.displayMenu = true;
		this.initGame = false;
        this.level = 1;
        this.modes = ['Player vs. Player', 'Player vs. CPU', 'CPU vs. CPU'];
        this.mode = 'Player vs. CPU';
        this.menu = new Menu(this,scene, this.level, this.mode);
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
    	    this.logPicking();
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
					var obj= pickResults[i][0]; // get object from result
						if (obj)  // exists? 
						{
							var uniqueId= pickResults[i][1] // get idt
							this.OnObjectSelected(obj, uniqueId);
						}
				} 

				// clear results 

				pickResults.splice(0, pickResults.length);
			}
	}

	onObjectSelected(obj, id){
		if(obj instanceof MyPiece){
			// do something with id knowing it is a piece
		}
		else if(obj instanceof MyTile){
			// do something with id knowing it is a tile
		}
		else {
			// error ? 
		}
	}

}