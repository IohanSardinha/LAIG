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
		this.gameSequence= new MyGameSequence();
		this.animator= new MyAnimator();
		this.gameboard= new MyGameBoard();
		this.theme= new MySceneGraph('jinli.xml', scene);
		this.prolog= new MyPrologInterface();		
	}

	update(time) {
		this.animator.update(time);
	}

	display() {
		//...
		this.theme.displayScene();
		//this.gameboard.display();
		//this.animator.display();
		//...
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