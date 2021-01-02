/**
* MyTurnIndicator
* @constructor
* @param scene - Reference to MyScene object
*/
class MyTurnIndicator extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.powered = true;

        this.onMaterial = new CGFappearance(this.scene);
        this.onMaterial.setAmbient(0.9, 0.9, 0.1, 1);
        this.onMaterial.setDiffuse(1.0, 1.0, 0.2, 1);
        this.onMaterial.setSpecular(0.6, 0.6, 0.2, 0.1);
        this.onMaterial.setShininess(1.0);
        
        this.offMaterial = new CGFappearance(this.scene);
        this.offMaterial.setAmbient(0.8,0.8,0.8, 1);
        this.offMaterial.setDiffuse(0.8,0.8,0.8, 1);
        this.offMaterial.setSpecular(0.8,0.8,0.8, 0.1);
        this.offMaterial.setShininess(1.0);

        this.sphere = new MySphere(scene, 0.5, 10,10);
    }

    display() {
        this.scene.pushMatrix(); 

        if(this.powered){
            this.onMaterial.apply();
        }
        else{
            this.offMaterial.apply();
        }
        this.sphere.display();


        this.scene.popMatrix();
    }



    updateTexCoords(length_s, length_t) {}
}