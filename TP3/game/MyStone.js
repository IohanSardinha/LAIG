class MyStone extends CGFobject {

	constructor(scene, color, index) {
		super(scene);
			
		this.color = color;
		this.index = index;
		this.tile = null;

		this.rock_model = new CGFOBJModel(scene, 'scenes/models/stone.obj', false);

	}
	
	display()
	{
		this.scene.pushMatrix();

			if(this.tile != null)
				this.scene.translate(3.85*(this.tile.line-1), 0, 3.85*(7-this.tile.column));
			else{
				if(this.color == 'r')
				{
					this.scene.translate(-2+this.index*3,0,29);
				}else{
					this.scene.translate(-2+this.index*3,0,-6);
				}
			}

        	this.rock_model.display();
		
		this.scene.popMatrix();
	}

}