class MySpritesheet extends CGFobject {
    constructor(scene, texture, sizeM, sizeN) 
    {
        super(scene);
        this.sizeM = sizeM;
        this.sizeN = sizeN;
        this.appearance = new CGFappearance(scene);
        this.texture = new CGFtexture(scene,texture);
        this.appearance.setTexture(this.texture);
        this.shader = new CGFshader(scene.gl, "shaders/sprite.vert", "shaders/sprite.frag");
        this.shader.setUniformsValues({ size_c: sizeM });
        this.shader.setUniformsValues({ size_l: sizeN });
        this.shader.setUniformsValues({ c: 0 });
        this.shader.setUniformsValues({ l: 0 });
    }

    activateCellMN(m, n)
    {
        this.shader.setUniformsValues({ c: m });
        this.shader.setUniformsValues({ l: n });
    }

    activateCellP(p)
    {
    var mp = p % this.sizeM;
    var np = ~~(p / this.sizeM); 
    this.activateCellMN(mp,np);
    }

}