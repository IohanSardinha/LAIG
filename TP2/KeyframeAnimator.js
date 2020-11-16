/**
 * KeyframeAnimator
 */
class KeyframeAnimator {
/*
 * @constructor
 * @param keyframes -Object {instant: transformation}
*/
    constructor(keyframes, scene) {
        this.keyframeAnimations = [];
        this.scene = scene;
        this.visible = false;

        let instants = Object.keys(keyframes).sort();
        let keyframeAnimation;

        for(let i = 0; i < instants.length-1; i++)
        {
            keyframeAnimation = new KeyframeAnimation(scene, instants[i], instants[i+1], keyframes[instants[i]], keyframes[instants[i+1]]);
            this.keyframeAnimations.push(keyframeAnimation);
        }

        this.currentKeyframe = this.keyframeAnimations[0];

     }

     update(instant)
     {
        if((this.keyframeAnimations.length < 1) || (instant < this.keyframeAnimations[0].instant))
        {
            this.visible = false;
            return;
        }
        this.visible = true;
        for(let i = 0; i < this.keyframeAnimations.length; i++)
            if((instant >= this.keyframeAnimations[i].instant && instant < this.keyframeAnimations[i].final_instant) || i == this.keyframeAnimations.length-1)
            {
                this.currentKeyframe = this.keyframeAnimations[i];
                this.keyframeAnimations[i].update(instant);
                break;
            } 
     }

     apply()
     {
     	if(this.visible)
            return this.currentKeyframe.apply();
        return mat4.create();
     }

}