/**
 * KeyframeAnimation
 */
class KeyframeAnimation extends Animation {
/*
 * @constructor
 * @param instant - integer:  second from begining in which the animation starts
 * @param initial_transform - {translation: {x,y,z}, rotation:{x,y,z}, scale:{x,y,z}}
 * @param final_transform  - {translation: {x,y,z}, rotation:{x,y,z}, scale:{x,y,z}}
*/
    constructor(instant, initial_transform, final_transform) {
        super(instant, initial_transform, final_transform);
     }

     update(instant)
     {
     	super(instant);
     }

     apply(transform)
     {
     	super(transform);
     }

}