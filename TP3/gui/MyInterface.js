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
        this.gui.destroy();
        this.gui = new dat.GUI();
        
        if (this.scene.graph.viewMap != null){
            this.gui.add(this.scene, 'selectedView', Array.from(this.scene.graph.viewMap.keys())).name('Current Camera').onChange(this.scene.changeCamera.bind(this.scene));
        }

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
        // create reference from the scene to the GUI
        this.scene.gui = this;
        // disable the processKeyboard function
        this.processKeyboard = function () { };
        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };
    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };
    isKeyPressed(keyCode) {
        if (this.activeKeys[keyCode] === true) {
            this.activeKeys[keyCode] = false;
            return true;
        }
        return this.activeKeys[keyCode] || false;
    }
}