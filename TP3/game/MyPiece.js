/*
* Game element that occupies tiles
* Piece can hold several piece types
* Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
* Methods:
	* get/set type
	* Display the piece (render)

*/
class MyPiece extends CGFobject {

	constructor(scene,tileID, color,angle) {
		super(scene);
			
		this.originalTile = tileID;

		this.tile = tileID;

		this.color = color;

		this.koi_model = new CGFOBJModel(scene, 'scenes/models/koi.obj', false);

		this.angle = angle;

	}

	calculateAngle(from, to) {
		let angle = 0;
		let angMultX = 0;
		if (from.line == to.line) {
			if (from.column < to.column) {
				angle = 90;
				angMultX = - 1 * (from.column - to.column);
			}
			else {
				angle = 270;
				angMultX = 1 * (from.column - to.column);
			}
		}
		else if (from.column == to.column) {
			if (from.line < to.line) {
				angle = 0;
				angMultX = -1 * (from.line - to.line);
			}
			else {
				angle = 180;
				angMultX = 1 * (from.line - to.line);
			}
		}
		else if (from.column < to.column) {
			if (from.line < to.line) {
				angle = 45;
				angMultX = -1 * (from.line - to.line);
			}
			else {
				angle = 135;
				angMultX = 1 * (from.line - to.line);
			}
			if (angMultX == 2)
				angMultX++;
		}
		else if (from.column > to.column) {
			if (from.line > to.line) {
				angle = 225;
				angMultX = 1 * (from.line - to.line);
			}
			else {
				angle = 315;
				angMultX = -1 * (from.line - to.line);
			}
			if (angMultX == 2)
				angMultX++;
		}
		
		return [angle, angMultX];
	}
	setAnimator(toTile, fromTile, initial_moment){
		let [angle, angMultX] = this.calculateAngle(fromTile, toTile);
		let start = {
			translation: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			scale: { x: 1, y: 1, z: 1 }
		};
		let middle = {
			translation: {
				x: angMultX * 50,
				y: 100,
				z: 0,
			},
			rotation: { x: 0, y: 0, z: 45 },
			scale: { x: 1, y: 1, z: 1 }
		};


		let end = {
			translation: {
				x: angMultX * 100,
				y: 0,
				z: 0,
			},
			rotation: { x: 0, y: 0, z: 0 },
			scale: { x: 1, y: 1, z: 1 }
		}; 

        let frames = [];
        frames[initial_moment] = start;
        frames[initial_moment+0.3] = middle;
        frames[initial_moment+0.6] = end;
		this.angle = angle;
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
			this.scene.rotate((Math.PI / 180) * this.angle, 0, 1, 0);

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

