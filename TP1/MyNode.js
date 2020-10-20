/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the component
 * @param materials - List of the materials of this component
 * @param texture - Texture of this component
 * @param l_s - Scale of the s factor of the texture
 * @param l_t - Scale of the t factor of the texture
 * @param primitives - list of primitive children of this component
 * @param nodes - list of component children of this component
 */

class MyNode extends CGFobject {
    constructor(scene, id, materials, texture, l_s, l_t, ) {
        super(scene);
        this.id = id;
        this.material = materials;

        this.texture = texture;
        this.l_s = l_s;
        this.l_t = l_t;

        this.transformations;
    }

    getMaterialID() {
        return this.material;
    }
}