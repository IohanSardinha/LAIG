/**
 * Animation
 * @abstract
 */
class Animation {
/*
 * @constructor
 * @param instant - integer:  second from begining in which the animation starts
 * @param initial_transform - {translation: {x,y,z}, rotation:{x,y,z}, scale:{x,y,z}}
 * @param final_transform  - {translation: {x,y,z}, rotation:{x,y,z}, scale:{x,y,z}}
*/
    constructor(instant, initial_transform, final_transform) {
        this.instant = instant;
        this.initial_transform = initial_transform;
        this.final_transform = final_transform;
     }

     update(instant){}

     apply(transform){}

}