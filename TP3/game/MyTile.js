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

		this.selectedMaterial = selectedMaterial;
		this.unselectedMaterial = unselectedMaterial;

		this.material = unselectedMaterial;

		this.plane = new MyPlane(scene, 1, 1);

	}
	
	select(){
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

