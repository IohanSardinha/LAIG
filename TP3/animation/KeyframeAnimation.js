/**
 * KeyframeAnimation
 */
class KeyframeAnimation extends MyAnimation {
/*
 * @constructor
 * @param initial_instant - integer:  second from begining in which the animation starts
  * @param final_instant - integer:  second from begining in which the animation ends
 * @param initial_transform - {translation: {x,y,z}, rotation:{x,y,z}, scale:{x,y,z}}
 * @param final_transform  - {translation: {x,y,z}, rotation:{x,y,z}, scale:{x,y,z}}
*/
    constructor(scene, initial_instant, final_instant, initial_transform, final_transform) {
        super(initial_instant, initial_transform, final_transform);

        this.scene = scene;
        this.final_instant = final_instant;
     	
     	this.time_delta = final_instant -  initial_instant;

     	this.transform = initial_transform;

        this.init = false;

     }

     difCoord3D(coord1, coord2, factor)
     {
     	return{
				x: coord1.x+(((coord2.x - coord1.x)/this.time_delta)*factor), 
				y: coord1.y+(((coord2.y - coord1.y)/this.time_delta)*factor),
				z: coord1.z+(((coord2.z - coord1.z)/this.time_delta)*factor)
		};
     }

     update(instant)
     {
     	if(instant < this.initial_instant)
     	{
     		this.transform = this.initial_transform;
     	}
     	else if(instant > this.final_instant)
     	{
     		this.transform = this.final_transform;
     	}
     	else
     	{
     		let deltaTime = instant - this.instant;
     		this.transform = {
     			translation : this.difCoord3D(this.initial_transform.translation, this.final_transform.translation, deltaTime),
     			rotation  : this.difCoord3D(this.initial_transform.rotation, this.final_transform.rotation, deltaTime),
     			scale     : this.difCoord3D(this.initial_transform.scale, this.final_transform.scale, deltaTime)
     		};
     	}
     }

     apply()
     {
        var transform = mat4.create();
     	mat4.translate(transform, transform, [this.transform.translation.x,this.transform.translation.y,this.transform.translation.z]);
     	mat4.rotateX(transform, transform,this.transform.rotation.x * Math.PI/180);
        mat4.rotateY(transform, transform,this.transform.rotation.y * Math.PI/180);
        mat4.rotateZ(transform, transform,this.transform.rotation.z * Math.PI/180);
        mat4.scale(transform,transform,  [this.transform.scale.x,this.transform.scale.y,this.transform.scale.z]);
        return transform;
     }

}