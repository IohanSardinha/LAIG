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
        this.koi_model.display();
	}

}

