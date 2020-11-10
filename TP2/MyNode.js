/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - ID of the node
 * @param materials - List of the materials of this node
 * @param texture - Texture of this node
 * @param l_s - Scale of the s factor of the texture
 * @param l_t - Scale of the t factor of the texture
 * @param transformations - list of transformations for this node
 * @param children - list of children for this node
 
 */

class MyNode extends CGFobject {
    constructor(scene, id, material, texture, l_s, l_t, transformations, children, animator) {
        super(scene);
        this.id = id;
        this.material = material;

        this.texture = texture;
        this.l_s = l_s;
        this.l_t = l_t;

        this.transformations = transformations;

        this.children = children;

        this.animator = animator;
    }

    getMaterialID() {
        return this.material;
    }
}