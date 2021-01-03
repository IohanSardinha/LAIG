/**
* Menu
* @constructor
* @param scene - Reference to MyScene object
*/
class Menu extends CGFobject {
    constructor(orchestrator, scene, level, mode) {
        super(scene);
        this.orchestrator = orchestrator;
        this.scene = scene;

        this.plane = new MyPlane(scene, 15, 15);
        this.rectangle = new MyRectangle(scene, -1, -1, 1, 1);


        this.initMaterials();
        this.initTextures();
        this.initMusic();

        this.mainMenu = true;
        this.ambient = 1;
        this.options = false;
        this.sound = false;
        this.level = level;
        this.game_mode = mode;
        this.game_modes = ['Player vs. Player', 'Player vs. CPU', 'CPU vs. CPU'];
    }

    initMusic(){
        this.background_music = new Audio('audio/lake.mp3');
        this.background_music.loop = true;
        this.background_music.volume = 0.1;
        if(this.sound)
            this.background_music.play();

    }

    initMaterials(){
        this.jinli_material = new CGFappearance(this.scene);
        this.jinli_material.setAmbient(1.0, 1.0, 1.0, 1);
        this.jinli_material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.jinli_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.jinli_material.setShininess(1.0);
        this.jinli_material.loadTexture('scenes/images/jinli.png');
        this.jinli_material.setTextureWrap('REPEAT', 'REPEAT'); 

        this.play_material = new CGFappearance(this.scene);
        this.play_material.setAmbient(1.0, 1.0, 1.0, 1);
        this.play_material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.play_material.setSpecular(0.1, 0.1, 0.1, 1);
        this.play_material.setShininess(1.0);
        this.play_material.loadTexture('scenes/images/play.png');
        this.play_material.setTextureWrap('REPEAT', 'REPEAT'); 
    
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1.0, 1.0, 1.0, 1);
        this.material.setDiffuse(0.6, 0.6, 0.6, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(1.0);
        this.material.setTexture(null);
        this.material.setTextureWrap('REPEAT', 'REPEAT');

        this.highlight_material = new CGFappearance(this.scene);
        this.highlight_material.setAmbient(0.9, 0.5, 0.2, 1);
        this.highlight_material.setDiffuse(0.9, 0.5, 0.2, 1);
        this.highlight_material.setSpecular(0.1, 0.05, 0.025, 0.1);
        this.highlight_material.setShininess(1.0);
            
        this.black_material = new CGFappearance(this.scene);
        this.black_material.setAmbient(0, 0, 0, 1);
        this.black_material.setDiffuse(0, 0, 0, 1);
        this.black_material.setSpecular(0, 0, 0, 1);
        this.black_material.setShininess(1.0);

        this.musicMaterial = new CGFappearance(this.scene);
        this.musicMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.musicMaterial.setDiffuse(0.6, 0.6, 0.6, 1);
        this.musicMaterial.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.musicMaterial.setShininess(1.0);
        this.musicMaterial.loadTexture('scenes/images/music.png');
        this.musicMaterial.setTextureWrap('REPEAT', 'REPEAT');

        this.nomusicMaterial = new CGFappearance(this.scene);
        this.nomusicMaterial.setAmbient(1.0, 1.0, 1.0, 1);
        this.nomusicMaterial.setDiffuse(0.6, 0.6, 0.6, 1);
        this.nomusicMaterial.setSpecular(0.1, 0.1, 0.1, 0.1);
        this.nomusicMaterial.setShininess(1.0);
        this.nomusicMaterial.loadTexture('scenes/images/nomusic.png');
        this.nomusicMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    initTextures(){
        this.options_texture = new CGFtexture(this.scene, 'scenes/images/options.png');
        this.return_texture = new CGFtexture(this.scene, 'scenes/images/return.png');
        this.go_back_texture = new CGFtexture(this.scene, 'scenes/images/go_back.png');
        this.mountain_texture = new CGFtexture(this.scene, 'scenes/images/mountain.png');
        this.lake_texture = new CGFtexture(this.scene, 'scenes/images/lake.png');
        this.tile = new CGFtexture(this.scene, 'scenes/images/tile.jpg');

        this.game_mode_texture = new CGFtexture(this.scene, 'scenes/images/game_mode.png');
        this.mode1_texture = new CGFtexture(this.scene, 'scenes/images/mode1.png');
        this.mode2_texture = new CGFtexture(this.scene, 'scenes/images/mode2.png');
        this.mode3_texture = new CGFtexture(this.scene, 'scenes/images/mode3.png');

        this.level_texture = new CGFtexture(this.scene, 'scenes/images/level.png');
        this.easy_texture = new CGFtexture(this.scene, 'scenes/images/easy.png');
        this.hard_texture = new CGFtexture(this.scene, 'scenes/images/hard.png');

    }

    display() {
        this.pickResults();
        this.scene.clearPickRegistration();
        
        this.scene.pushMatrix();
        this.scene.scale(1.5, 1, 1);
        this.scene.translate(0, 70, 10);      
        this.displayBackground();
        if(this.options){
            this.displayOptions();
            this.scene.clearPickRegistration();
        }else{
            this.displayMenu();
            this.scene.clearPickRegistration();
        }
        this.scene.popMatrix();
    }

    displayBackground(){
        this.scene.pushMatrix();
        this.scene.scale(6,5, 1);
        this.material.setTexture(this.tile);
        this.material.apply();
        this.rectangle.display();
        this.scene.popMatrix();
    }

    displayOptions(){
        this.scene.pushMatrix();
            //Go back
            this.scene.pushMatrix();
                this.scene.translate(-3, 3.25, 0);
                this.scene.scale(1.5, 0.8, 1);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                
                this.material.setTexture(null);
                this.material.apply();
                this.scene.registerForPick(5, this.plane);
                this.plane.display();

                this.material.setTexture(this.go_back_texture);
                this.material.apply();
                this.plane.display();
            this.scene.popMatrix();

            this.scene.clearPickRegistration();
                
            this.scene.translate(0, -1.5, 0);    
            this.scene.scale(1, 1.5, 1);    
            //Level
            this.displayLevel();

            //Mode
            this.displayMode();
            
        this.scene.popMatrix();
    }

    displayLevel(){
        this.scene.pushMatrix();
                this.scene.translate(-2, 1, 0);
                this.scene.scale(2.5, 3, 1);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                
                this.material.setTexture(this.tile);
                this.material.apply();
                
                this.plane.display();

                this.scene.pushMatrix();
                    this.scene.pushMatrix();
                        this.scene.translate(-0.15, 0, -0.35);
                        this.scene.scale(0.6, 1, 0.30);
                        this.material.setTexture(this.level_texture);
                        this.material.apply();
                        this.plane.display();
                    this.scene.popMatrix();
                    
                    this.scene.pushMatrix();
                        this.scene.translate(0, 0, -0.15);
                        this.scene.registerForPick(6, this.plane);
                        this.scene.pushMatrix();
                            this.scene.translate(-0.25, 0, 0);
                            this.scene.pushMatrix();
                                this.black_material.apply();
                                this.scene.scale(0.11, 1, 0.11);
                                this.plane.display();
                            this.scene.popMatrix();
                            this.scene.scale(0.1, 1, 0.1);
                            if(this.level === 1){
                                this.highlight_material.apply();
                            }
                            else{
                                this.black_material.apply();
                            }
                            this.plane.display();
                        this.scene.popMatrix();

                        this.scene.pushMatrix();
                            this.scene.translate(0.015, 0, 0.00);
                            this.scene.scale(0.4, 1, 0.2);
                            this.material.setTexture(this.easy_texture);
                            this.material.apply();
                            this.plane.display();
                        this.scene.popMatrix();
                        this.scene.clearPickRegistration();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0, 0, 0.01);
                        this.scene.registerForPick(7, this.plane);
                        this.scene.pushMatrix();
                            this.scene.translate(-0.25, 0, 0);
                            this.scene.pushMatrix();
                                this.black_material.apply();
                                this.scene.scale(0.11, 1, 0.11);
                                this.plane.display();
                            this.scene.popMatrix();
                            this.scene.scale(0.1, 1, 0.1);
                            if(this.level === 2){
                                this.highlight_material.apply();
                            }
                            else{
                                this.black_material.apply();
                            }
                            this.plane.display();
                        this.scene.popMatrix();

                        this.scene.pushMatrix();
                            this.scene.translate(0.02, 0, 0);
                            this.scene.scale(0.4, 1, 0.2);
                            this.material.setTexture(this.hard_texture);
                            this.material.apply();
                            this.plane.display();
                        this.scene.popMatrix();
                        this.scene.clearPickRegistration();
                    this.scene.popMatrix();

                this.scene.popMatrix();
            this.scene.popMatrix();
    }

    displayMode(){
        this.scene.translate(4.25, 0, 0);
        this.scene.scale(1.25, 1, 1);

        this.scene.pushMatrix();
                this.scene.translate(-2, 1, 0);
                this.scene.scale(2.5, 3, 1);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                
                this.material.setTexture(this.tile);
                this.material.apply();
                
                this.plane.display();

                this.scene.pushMatrix();
                    this.scene.pushMatrix();
                        this.scene.translate(0, 0, -0.35);
                        this.scene.scale(0.9, 1, 0.5);
                        this.material.setTexture(this.game_mode_texture);
                        this.material.apply();
                        this.plane.display();
                    this.scene.popMatrix();
                    
                    this.scene.pushMatrix();
                        this.scene.translate(0, 0, -0.15);
                        this.scene.registerForPick(8, this.plane);
                        this.scene.pushMatrix();
                            this.scene.translate(-0.25, 0, 0);
                            this.scene.pushMatrix();
                                this.black_material.apply();
                                this.scene.scale(0.11, 1, 0.11);
                                this.plane.display();
                            this.scene.popMatrix();
                            this.scene.scale(0.1, 1, 0.1);
                            if(this.game_mode === this.game_modes[0]){
                                this.highlight_material.apply();
                            }
                            else{
                                this.black_material.apply();
                            }
                            this.plane.display();
                        this.scene.popMatrix();

                        this.scene.pushMatrix();
                            this.scene.translate(0.13, 0, 0);
                            this.scene.scale(0.6, 1, 0.3);
                            this.material.setTexture(this.mode1_texture);
                            this.material.apply();
                            this.plane.display();
                        this.scene.popMatrix();
                        this.scene.clearPickRegistration();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0, 0, 0.075);
                        this.scene.registerForPick(9, this.plane);
                        this.scene.pushMatrix();
                            this.scene.translate(-0.25, 0, 0);
                            this.scene.pushMatrix();
                                this.black_material.apply();
                                this.scene.scale(0.11, 1, 0.11);
                                this.plane.display();
                            this.scene.popMatrix();
                            this.scene.scale(0.1, 1, 0.1);
                            if(this.game_mode === this.game_modes[1]){
                                this.highlight_material.apply();
                            }
                            else{
                                this.black_material.apply();
                            }
                            this.plane.display();
                        this.scene.popMatrix();

                        this.scene.pushMatrix();
                            this.scene.translate(0.13, 0, 0);
                            this.scene.scale(0.6, 1, 0.3);
                            this.material.setTexture(this.mode2_texture);
                            this.material.apply();
                            this.plane.display();
                        this.scene.popMatrix();
                        this.scene.clearPickRegistration();
                    this.scene.popMatrix();

                    this.scene.pushMatrix();
                        this.scene.translate(0, 0, 0.3);
                        this.scene.registerForPick(10, this.plane);
                        this.scene.pushMatrix();
                            this.scene.translate(-0.25, 0, 0);
                            this.scene.pushMatrix();
                                this.black_material.apply();
                                this.scene.scale(0.11, 1, 0.11);
                                this.plane.display();
                            this.scene.popMatrix();
                            this.scene.scale(0.1, 1, 0.1);
                            if(this.game_mode === this.game_modes[2]){
                                this.highlight_material.apply();
                            }
                            else{
                                this.black_material.apply();
                            }
                            this.plane.display();
                        this.scene.popMatrix();

                        this.scene.pushMatrix();
                            this.scene.translate(0.09, 0, 0);
                            this.scene.scale(0.5, 1, 0.3);
                            this.material.setTexture(this.mode3_texture);
                            this.material.apply();
                            this.plane.display();
                        this.scene.popMatrix();
                        this.scene.clearPickRegistration();
                    this.scene.popMatrix();

                this.scene.popMatrix();
            this.scene.popMatrix();
    }

    displayMenu(){
        this.scene.pushMatrix();

            //JIN LI NAME
            this.scene.pushMatrix();
                this.material.setTexture(null);
                this.jinli_material.apply();
                this.scene.translate(0, 2, 0);
                this.scene.scale(6, 3, 2);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.plane.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
                this.scene.translate(0, 0.25, 0);
                this.scene.scale(2, 1, 1);
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.material.setTexture(null);
                this.material.apply();
            
            if(this.mainMenu)
            {
                //Play Button
                this.scene.registerForPick(1, this.plane);
                this.plane.display();         
                this.play_material.apply();  
            }
            else
            {
                //Return Button
                this.scene.registerForPick(11, this.plane);
                this.plane.display();
                this.material.setTexture(this.return_texture);
                this.material.apply();
            }
                this.plane.display();
                this.scene.popMatrix();

            //Options Button
            this.scene.pushMatrix();
                this.scene.translate(0, -1, 0);
                this.scene.scale(2, 1, 1);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.registerForPick(2, this.plane);
                this.material.setTexture(null);
                this.material.apply();
                this.plane.display();

                this.material.setTexture(this.options_texture);
                this.material.apply();
                this.plane.display();
            this.scene.popMatrix();

            //Mountain Button
            this.scene.pushMatrix();
                this.scene.translate(-1.5, -2.5, 0);
                this.scene.scale(2, 1, 1);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.pushMatrix();
                    this.scene.scale(1.025, 1.05, 1.05);
                    if(this.ambient === 1){
                        this.highlight_material.apply();
                    }else{
                        this.material.setTexture(this.tile);
                        this.material.apply();
                    }
                    this.scene.registerForPick(3, this.plane);
                    this.plane.display();
                this.scene.popMatrix();
                this.material.setTexture(this.mountain_texture);
                this.material.apply();
                this.plane.display();
            this.scene.popMatrix();

            //Lake Button
            this.scene.pushMatrix();
                this.scene.translate(1.5, -2.5, 0);
                this.scene.scale(2, 1, 1);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.pushMatrix();
                    this.scene.scale(1.025,1, 1.05);
                    if(this.ambient === 2){
                        this.highlight_material.apply();
                    }else{
                        this.material.setTexture(this.tile);
                        this.material.apply();
                    }
                    this.scene.registerForPick(4, this.plane);
                    this.plane.display();
                this.scene.popMatrix();

                this.material.setTexture(this.lake_texture);
                this.material.apply();
                this.plane.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(4.5, 2.5, 0);
            this.scene.scale(0.5, 1, 1);
            this.scene.rotate(Math.PI / 2, 1, 0, 0);
            if (this.sound) {
                this.musicMaterial.apply();
            } else {
                this.nomusicMaterial.apply();
            }
            this.scene.registerForPick(12, this.plane);
            this.plane.display();
            this.scene.popMatrix();
            
            this.scene.clearPickRegistration();

        this.scene.popMatrix();
    }

    startGame(){
        this.mainMenu = false;
        this.scene.gameOrchestrator.score.started = true;
        this.scene.gameOrchestrator.initGame = true;
        if(this.sound)
        {
            this.background_music.play();
        }
        this.scene.gameOrchestrator.setMode(this.level, this.game_mode);
        this.scene.gameOrchestrator.start();   
    }

    toggleMusic(){
        if(this.sound)
        {
           this.background_music.pause(); 
           this.sound = false;
        }
        else{
            this.background_music.play(); 
            this.sound = true;

        }
        
    }


    showMenu(){
        this.scene.gameOrchestrator.displayMenu = true;
        this.scene.selectedView = 'Menu';
        this.scene.changeCamera();
        this.scene.interface.setInterface();
    }

    exitMenu(){
        this.scene.gameOrchestrator.displayMenu = false;
        this.scene.selectedView = this.scene.gameOrchestrator.theme.defaultViewId;
        this.scene.changeCamera(); 
        this.scene.interface.setInterface();
    }

    toggleMenu(){
        if (this.scene.selectedView == 'Menu')
        {
            this.exitMenu();
        }
        else{
            this.showMenu();
        }
    }
    pickResults() {
		if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {

                for (var i = 0; i < this.scene.pickResults.length; i++) {
					var obj = this.scene.pickResults[i][0];
					if (obj) {
                        let index = this.scene.pickResults[i][1]; 
                        
                        console.log("Picked object: " + obj + ", with pick id " + index);	
                    
                        switch(index){
                            case 1:
                                this.startGame();
                                break;
                            case 2:
                                this.options = true;
                                break;
                            case 3:
                                this.ambient = 1;
                                this.scene.gameOrchestrator.changeAmbient();
                                break;
                            case 4:
                                this.ambient = 2;
                                this.scene.gameOrchestrator.changeAmbient();
                                break;
                            case 5:
                                this.options = false;
                                break;
                            case 6:
                                this.level = 1;
                                this.scene.gameOrchestrator.setMode(this.level, this.game_mode);
                                break;
                            case 7:
                                this.level = 2;
                                this.scene.gameOrchestrator.setMode(this.level,this.game_mode);
                                break;
                            case 8:
                                this.game_mode = this.game_modes[0];
                                this.scene.gameOrchestrator.setMode(this.level, this.game_mode);
                                break;
                            case 9:
                                this.game_mode = this.game_modes[1];
                                this.scene.gameOrchestrator.setMode(this.level, this.game_mode);
                                break;
                            case 10:
                                this.game_mode = this.game_modes[2];
                                this.scene.gameOrchestrator.setMode(this.level, this.game_mode);
                                break;
                            case 11:
                                this.exitMenu();
                                break;
                            case 12:
                                this.toggleMusic();
                                break;
                            default:
                                break;
                        }
                    }
				}
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }

    updateTexCoords(length_s, length_t) {}
}