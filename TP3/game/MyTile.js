/*
* Unitary element that creates the gameboard and auxiliary board spaces.
* Has pointer to gameboard and pointer to piece (if a piece occupies tile)
Methods:
	* Set/unset piece on tile
	* Get piece using tile
	* Display the tile (render)

*/
class MyTile extends CGFobject {

	constructor(scene, id, selectedMaterial, unselectedMaterial) {
		super(scene);
			
		this.id = id;

		this.line = id.toLowerCase().charCodeAt(0) - 96;
		this.column = parseInt(id[1]);

		this.selectedMaterial = selectedMaterial;
		this.unselectedMaterial = unselectedMaterial;

		this.material = unselectedMaterial;
		this.selected = false;

		this.plane = new MyPlane(scene, 1, 1);

		this.gameboard = null;
		this.piece = null;

	}
	

	hasPlayer(player){
		return this.gameboard != null && this.piece != null && this.piece.color == player;

	}

	select(value = null){

		if(value != null)
		{
			this.selected = value;
			if(value)
				this.material = this.selectedMaterial;
			else
				this.material = this.unselectedMaterial;
			return;
		}
		this.selected = !this.selected;
		if(this.material == this.unselectedMaterial)
			this.material = this.selectedMaterial;
		else
			this.material = this.unselectedMaterial;
	}

	display()
	{
		this.material.apply();
        this.plane.display();
	}

}

