/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the component
 * @param materials - List of the materials of this component
 * @param texture - Texture of this component
 * @param l_s - Scale of the s factor of the texture
 * @param l_t - Scale of the t factor of the texture
 * @param transformations - list of transformations for this component
 
 */

class MyNode extends CGFobject {
    constructor(scene, id, material, texture, l_s, l_t, transformations, children) {
        super(scene);
        this.id = id;
        this.material = material;

        this.texture = texture;
        this.l_s = l_s;
        this.l_t = l_t;

        this.transformations = transformations;

        this.children = children;
    }

    getMaterialID() {
        return this.material;
    }
}