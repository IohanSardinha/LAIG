class MySpriteText extends CGFobject {
    constructor(scene, text) {
        super(scene);
        this.text = text;
        this.rect = new MyRectangle(scene, 0, 0, 1, 1);
        this.sprite = new MySpritesheet(scene, "scenes/images/font.png", 8, 9);
    }

    getCharacterPosition(character) {
    
    }

    display() {
        this.sprite.appearance.apply();
        this.scene.setActiveShader(this.sprite.shader);
        this.rect.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.defaultAppearance.apply();
    }

}