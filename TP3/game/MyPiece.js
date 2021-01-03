/*
* Game element that occupies tiles
* Piece can hold several piece types
* Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
* Methods:
	* get/set type
	* Display the piece (render)

*/
class MyPiece extends CGFobject {

	constructor(scene,tileID, color) {
		super(scene);
			
		this.tile = tileID;

		this.color = color;

		this.koi_model = new CGFOBJModel(scene, 'scenes/models/koi.obj', false);

	}

	setAnimator(toTile, fromTile, initial_moment){
		let start = {
                translation: {x:0, y:0, z:0},
                rotation:    {x:0, y:0, z:0},
                scale:       {x:1, y:1, z:1}
            }; 

        let middle = {
            translation: {
                x: (this.color == 'r' ?  1: -1) * 50*(toTile.column - fromTile.column), 
                y: 100, 
                z: (this.color == 'r' ?  1: -1) * 50*(toTile.line - fromTile.line)
            },
            rotation:    {x:0, y:0, z:45},
            scale:       {x:1, y:1, z:1}
        }; 


        let end = {
            translation: {
                x: (this.color == 'r' ?  1: -1) * 100*(toTile.column - fromTile.column), 
                y: 0, 
                z: (this.color == 'r' ?  1: -1) * 100*(toTile.line - fromTile.line)
            },
            rotation:    {x:0, y:0, z:0},
            scale:       {x:1, y:1, z:1}
        }; 

        let frames = [];
        frames[initial_moment] = start;
        frames[initial_moment+0.3] = middle;
        frames[initial_moment+0.6] = end;

        this.animator = new KeyframeAnimator(frames, this.scene);
	}
	
	animate(time){
		this.animator.update(time);
		return !this.animator.ended;
	}

	display()
	{

		this.scene.pushMatrix();
	

			this.scene.translate(97*(this.tile.line-1), 0, 97*(7-this.tile.column));

			if(this.color == 'r')
				this.scene.rotate(Math.PI/2, 0, 1, 0);
			else
				this.scene.rotate(-Math.PI/2, 0, 1, 0);

			if(this.animator){
				let display = this.animator.apply();
				if(display)
				{
					this.scene.multMatrix(display);
				}
			}
        	this.koi_model.display();
		
		this.scene.popMatrix();
	}

}

