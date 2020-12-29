/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)
 
        this.initKeys();

        return true;
    }

    setInterface(){
        // this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        // this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        // this.gui.add(this.scene, 'displayLights').name('Display Lights');

        // this.gui.add(this.scene.graph, 'activateMaterials').name('Materials Active');

        // this.gui.add(this.scene.graph, 'activateTextures').name('Textures Active');
        
        // this.gui.add(this.scene, 'selectedView', Array.from(this.scene.graph.viewMap.keys())).name('Current Camera').onChange(this.scene.changeCamera.bind(this.scene));

        // this.lightsFolder = this.gui.addFolder('Enable Lights');

        // var i = 0;
        // var graphLight = this.scene.graph.lights
        // for (var key in graphLight) {
        //     if (graphLight.hasOwnProperty(key)) {
        //         this.lightsFolder.add(this.scene.lightIDs[i],'enabled').name(key);
        //         i++;
        //     }
        // }

    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}