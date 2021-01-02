/**
* ScoreClock
* @constructor
* @param scene - Reference to MyScene object
*/
class ScoreClock extends CGFobject {
    constructor(scene, level) {
        super(scene);
        this.scene = scene;

        this.woodMaterial = new CGFappearance(this.scene);
        this.woodMaterial.setAmbient(0.2, 0.1, 0.0, 1);
        this.woodMaterial.setDiffuse(0.2, 0.1, 0.0, 1);
        this.woodMaterial.setSpecular(0.02, 0.01, 0.0, 0.1);
        this.woodMaterial.setShininess(1.0);

        this.digitMaterial = new CGFappearance(this.scene);
        this.digitMaterial.setAmbient(0.8,0.8,0.8, 1);
        this.digitMaterial.setDiffuse(0.8,0.8,0.8, 1);
        this.digitMaterial.setSpecular(0.8,0.8,0.8, 0.1);
        this.digitMaterial.setShininess(10.0);
        
        this.plane = new MyPlane(scene, 15, 15);

        this.height = 0.25*Math.tan(Math.PI/3);

        this.triangle1 = new MyTriangle(scene, 0, 0, 0.25, 0, 0, this.height);
        this.triangle2 = new MyTriangle(scene, 0, 0, 0, this.height, 0.25, 0);
        this.undo = new MyUndoButton(scene);
        this.turnP1 = new MyTurnIndicator(scene);
        this.turnP2 = new MyTurnIndicator(scene);
        this.createNumbers();

        this.score = "00-00";
        this.level = level || 1;
        this.turnP1.powered = true;
        this.firstPlayerTime;
        this.secondPlayerTime;
        this.started = false;

        this.createTimeString();

        this.alarm = new Audio('audio/alarm.mp3');
        this.alarm.volume = 0.25;
        this.alarm.loop = true;

    }

    
    setLevel(level){
        this.level = level;
        this.firstPlayerTime = 150000 * this.level;
        this.secondPlayerTime = 150000 * this.level;
            
        this.createTimeString();
    }

    createNumbers(){
        this.numbers = [
            new Zero(this.scene),
            new One(this.scene),
            new Two(this.scene),
            new Three(this.scene),
            new Four(this.scene),
            new Five(this.scene),
            new Six(this.scene),
            new Seven(this.scene),
            new Eight(this.scene),
            new Nine(this.scene)
        ];
        this.separator = new Hexagon(this.scene);
    }

    display() {
        this.scene.pushMatrix(); 

            this.scene.pushMatrix();
            this.scene.translate(6,5,25);
            this.scene.scale(1.3, 2, 1.5);
            this.scene.registerForPick(400, this.undo);
            this.undo.display(); 
            this.scene.clearPickRegistration();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(6, 5, 22.5);
            this.turnP2.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(6, 5, 27.5);
            this.turnP1.display();
            this.scene.popMatrix();

            this.woodMaterial.apply();
            this.scene.scale(4,4,8);
            this.scene.translate(1.5, 0.3, 3.1);
            this.scene.rotate(Math.PI, 0, 1, 0);

            this.scene.pushMatrix();
                this.scene.translate(0, -0.2, 0);
                this.scene.rotate(Math.PI, 0, 0, 1);
                this.plane.display();
            this.scene.popMatrix();


            this.scene.pushMatrix();
                this.scene.translate(0, -0.1, 0.5);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.scale(1, 1, 0.2);
                this.plane.display();
            this.scene.popMatrix();  

            this.scene.pushMatrix();
                this.scene.translate(0, -0.1, -0.5);
                this.scene.rotate(-Math.PI/2, 1, 0, 0);
                this.scene.scale(1, 1, 0.2);
                this.plane.display();
            this.scene.popMatrix(); 


            this.scene.pushMatrix();
                this.scene.translate(-0.5, -0.1, 0);
                this.scene.rotate(Math.PI/2, 0, 0, 1);
                this.scene.scale(0.2, 1, 1);
                this.plane.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0.5, -0.1, 0);
                this.scene.rotate(-Math.PI/2, 0, 0, 1);
                this.scene.scale(0.2, 1, 1);
                this.plane.display();
            this.scene.popMatrix();        

            this.scene.pushMatrix();
                this.scene.scale(1, 2, 1);

                this.scene.pushMatrix();
                    this.scene.translate(0, this.height-0.003, 0);
                    this.scene.scale(0.5, 0.5, 1);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(0.376, 0.215, 0);
                    this.scene.rotate(-Math.PI/3, 0, 0, 1);
                    this.scene.scale(0.5, 1, 1);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(-0.376, 0.215, 0);
                    this.scene.rotate(Math.PI/3, 0, 0, 1);
                    this.scene.scale(0.5, 1, 1);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.scale(0.5, 0.4275, 1);
                    this.scene.translate(0, 0.5, 0.5);
                    this.scene.rotate(Math.PI/2, 1, 0, 0);
                    this.plane.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(0.25, 0, 0.5);
                    this.triangle1.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.translate(-0.25, 0, 0.5);
                    this.scene.rotate(Math.PI, 0, 1, 0);
                    this.triangle2.display();
                this.scene.popMatrix();

                this.scene.pushMatrix();
                    this.scene.rotate(Math.PI, 0, 1, 0);

                    this.scene.pushMatrix();
                        this.scene.scale(0.5, 0.4275, 1);
                        this.scene.translate(0, 0.5, 0.5);
                        this.scene.rotate(Math.PI/2, 1, 0, 0);
                        this.plane.display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0.25, 0, 0.5);
                        this.triangle1.display();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(-0.25, 0, 0.5);
                        this.scene.rotate(Math.PI, 0, 1, 0);
                        this.triangle2.display();
                    this.scene.popMatrix();
                this.scene.popMatrix();


                this.digitMaterial.apply();

                this.scene.pushMatrix();

                    this.displayScore();
                    this.displayTime();

                this.scene.popMatrix();

            this.scene.popMatrix();    
        this.scene.popMatrix();
    }

    displayScore(){
        this.scene.pushMatrix();
            this.scene.translate(0.43, 0.125, 0.3);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[0])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.43, 0.125, 0.175);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[1])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.455, 0.085, 0.0);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.separator.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.43, 0.125, -0.215);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[3])].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.43, 0.125, -0.34);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.numbers[Number(this.score[4])].display();
        this.scene.popMatrix();
    }

    displayTime(){
        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.4);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);

            this.scene.pushMatrix();
                if(this.secondPlayerTime === 0){
                    
                }
                this.numbers[Number(this.time[0])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.3);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.pushMatrix();
                if(this.secondPlayerTime === 0){
                    
                }
                this.numbers[Number(this.time[1])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(0.35, 0.33, 0.26);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);

            this.scene.pushMatrix();
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(0.35, 0.275, 0.26);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);

            this.scene.pushMatrix();
                
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.15);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);

            this.scene.pushMatrix();
                if(this.secondPlayerTime === 0){
                    
                }
                this.numbers[Number(this.time[3])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, 0.05);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.pushMatrix();
                if(this.secondPlayerTime === 0){
                    
                }
                this.numbers[Number(this.time[4])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.45);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.pushMatrix();
                
                this.numbers[Number(this.time[10])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.35);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.pushMatrix();
                
                this.numbers[Number(this.time[9])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(0.31, 0.33, -0.25);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);

            this.scene.pushMatrix();
                
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();

            this.scene.translate(0.35, 0.275, -0.25);
            this.scene.scale(0.03, 0.03, 0.01);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);

            this.scene.pushMatrix();
                
                this.separator.display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.2);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.pushMatrix();
                
                this.numbers[Number(this.time[7])].display();
            this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.3, 0.35, -0.1);
            this.scene.scale(0.03, 0.03, 0.025);

            this.scene.rotate(Math.PI/6, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.pushMatrix();
                
                this.numbers[Number(this.time[6])].display();
            this.scene.popMatrix();            
        this.scene.popMatrix();
    }

    updateScore(score){
        this.score = "";
        if (score[0] < 10){
            this.score += String(0);
        }
        this.score += String(score[1]);
        
        this.score += "-";

        if (score[1] < 10){
            this.score += String(0);
        }
        this.score += String(score[0]);
    }

    updateTime(t, player){
        if(this.started)
        {
            
        if(player === 'r'){
            this.firstPlayerTime -= t;
            this.turnP1.powered = true;
            this.turnP2.powered = false;

            if(this.firstPlayerTime <= 0){
                if(this.scene.gameOrchestrator.menu.sound){
                    this.alarm.play();
                }
                this.firstPlayerTime = 0;
               
                return true;
            }
        }else if(player === 'y'){
            this.secondPlayerTime -= t;
             this.turnP1.powered = false;
             this.turnP2.powered = true;
            if(this.secondPlayerTime <= 0){
                if (this.scene.gameOrchestrator.menu.sound) {
                    this.alarm.play();
                }
                this.secondPlayerTime = 0;
               
                return true;
            }
        }

        this.createTimeString(); 
        }
       
    }
    
    createTimeString(){
        const firstSec = Math.trunc((this.firstPlayerTime/1000.0) % 60);
        const secondSec = Math.trunc((this.secondPlayerTime/1000.0) % 60);
        const firstMin = Math.trunc((this.firstPlayerTime/1000.0) / 60);
        const secondMin = Math.trunc((this.secondPlayerTime/1000.0) / 60);
        let newTime = "";
        if(secondMin < 10){
            newTime += String(0);
        }
        newTime += String(secondMin);
        newTime += ":";
        if(secondSec < 10){
            newTime += String(0);
        }
        newTime += String(secondSec);   
        newTime += "-";
        if(firstMin < 10){
            newTime += String(0);
        }
        newTime += String(firstMin);   
        newTime += ":";
        if(firstSec < 10){
            newTime += String(0);
        }
        newTime += String(firstSec);
        this.time = newTime;
    }
    
    updateTexCoords(length_s, length_t) {}
}