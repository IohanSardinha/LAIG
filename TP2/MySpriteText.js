class MySpriteText extends CGFobject {
    constructor(scene, text) {
        super(scene);
        this.text = text;
        this.rect = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.sprite = new MySpritesheet(scene, "scenes/images/font.png", 10, 10);
    }

    getCharacterPosition(character) 
    {
        var cell = character.charCodeAt(0) - 32;
        if (cell < 0 && cell > 94) 
        {
            cell = 0;
        } 
    return cell;
    }

    display() {
        this.sprite.appearance.apply();
        this.scene.setActiveShaderSimple(this.sprite.shader);
        this.scene.pushMatrix();

        for (var x = 0, char = ''; char = this.text.charAt(x); x++) {
            this.sprite.activateCellP(this.getCharacterPosition(char));
            this.rect.display();
            this.scene.translate(1, 0, 0);
        }
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.defaultAppearance.apply();

    }

}