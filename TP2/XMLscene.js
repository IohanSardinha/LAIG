/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInitiated = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance = new CGFappearance(this);

     

        this.scaleFactor = 1;
        this.displayAxis = false;
        this.displayLights = false;
        this.selectedView = null;

    }
    update(t)
    {   
        if(this.sceneInitiated)
        {
            for (var anim in this.graph.spriteanims) {
                this.graph.spriteanims[anim].update(t);
        }
    }}
    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.
        this.lightIDs = []
        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.
            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);

                this.lightIDs[i] = { key : key , enabled: graphLight[0] };

                if (graphLight[0])
                {
                    this.lights[i].enable();
                }
                else
                {
                    this.lights[i].disable();

                }                   
                this.lights[i].update();
                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.camera = this.graph.camera;

        this.interface.setActiveCamera(this.camera);

        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        this.selectedView = this.graph.defaultViewId;

        this.changeCamera();

        this.interface.setInterface();
        

        
        this.sceneInitiated = true;
    }

    changeCamera() {

        // this set the camera to the selectedView
        this.camera = this.graph.viewMap.get(this.selectedView);
        // this enables the camera movement
        this.interface.setActiveCamera(this.camera);
    }

    updateLights(){
        //Iterates through lightsIDs containing the light state booleans and sets them accordingly.
        for (var key in this.lightIDs) 
        {
            if(this.lightIDs[key].enabled)
            {
                this.lights[key].enable();
            }
            else 
            {
                this.lights[key].disable();
            }
            this.lights[key].update();            
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.scale(this.scaleFactor,this.scaleFactor,this.scaleFactor);
        
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].setVisible(this.displayLights);
            this.lights[i].enable();
        }

        if (this.sceneInitiated) {
            // Draw axis
            if(this.displayAxis)
                this.axis.display();
                
            // Updates the state of the lights.
            this.updateLights();

            //this.anim.update();
            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else
        {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}