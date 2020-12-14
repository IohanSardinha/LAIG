class MySpriteAnimation extends CGFobject {
    constructor(scene, ssid, startCell, endCell, duration) {

        super(scene);
        this.sprite = this.scene.graph.spritesheets[ssid];
        this.startCell = startCell;
        this.endCell = endCell;
        this.duration = duration*1000;
        this.rect = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);
        this.currentCell = startCell;
        this.nCells = (endCell - startCell + 1);
        this.increment = this.nCells/this.duration ;
        
    }

    update(t){
        this.lastTime = this.lastTime || 0;
        this.deltaTime = t - this.lastTime;
        this.lastTime = t;
        var timeIndependence = this.deltaTime;
        this.currentCell += this.increment*timeIndependence;
       
        if(this.currentCell >(this.endCell+1)){
            this.currentCell = this.startCell;
        }
        this.sprite.activateCellP(~~(this.currentCell));
        
    }
    display(){
        this.sprite.appearance.apply();
        this.scene.setActiveShaderSimple(this.sprite.shader);
        this.rect.display();
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.defaultAppearance.apply();
    }
}
