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

