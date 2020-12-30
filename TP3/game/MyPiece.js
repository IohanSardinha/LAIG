/*
* Game element that occupies tiles
* Piece can hold several piece types
* Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
* Methods:
	* get/set type
	* Display the piece (render)

*/
class MyPiece extends CGFobject {


	//<leaf type="clickable" id='' pick_id='' size='' />
	constructor(scene, id) {
		super(scene);
			
		this.id = id;

		this.plane = new MyPlane(scene, 1, 1);

	}
	
	display()
	{
        this.plane.display();
	}

}

