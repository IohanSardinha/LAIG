/**
 * KeyframeAnimation
 */
class KeyframeAnimation extends Animation {
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

        this.last_time= null;

     }

     difCoord3D(coord1, coord2, factor)
     {
     	return{
				x: ((coord2.x - coord1.x)/this.time_delta)*factor, 
				y: ((coord2.y - coord1.y)/this.time_delta)*factor,
				z: ((coord2.z - coord1.z)/this.time_delta)*factor
		};
     }

     update(instant)
     {
        if(this.last_time == null)
        {
            this.last_time = instant;
            return;
        }
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
     		let deltaTime = instant - this.last_time;
     		this.transform = {
     			translation : this.difCoord3D(this.initial_transform.translation, this.final_transform.translation, deltaTime),
     			rotation  : this.difCoord3D(this.initial_transform.rotation, this.final_transform.rotation, deltaTime),
     			scale     : this.difCoord3D(this.initial_transform.scale, this.final_transform.scale, deltaTime)
     		};
            console.log(deltaTime);
     	}
        this.last_time = instant;
     }

     apply()
     {
     	this.scene.translate(this.transform.translation.x,this.transform.translation.y,this.transform.translation.z);
     	this.scene.rotate(this.transform.rotation.x * Math.PI/180 ,1,0,0);
     	this.scene.rotate(this.transform.rotation.y * Math.PI/180 ,0,1,0);
     	this.scene.rotate(this.transform.rotation.z * Math.PI/180 ,0,0,1);
     	this.scene.scale(this.transform.scale.x,this.transform.scale.y,this.transform.scale.z);
     }

}