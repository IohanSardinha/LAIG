class MyClickableArea extends CGFobject {


	//<leaf type="clickable" id='' pick_id='' size='' />
	constructor(scene, id, picking_id, size) {
		super(scene);
		this.id = id;
		this.picking_id = picking_id;

		this.plane = new MyPlane(scene, size, size);

	}
	
	display()
	{
		this.scene.registerForPick(this.picking_id, this);
        this.plane.display();
        this.scene.clearPickRegistration();
	}

}

