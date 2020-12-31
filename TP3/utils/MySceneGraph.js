const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.idRoot = null;                    // The id of the root element.

        this.activateMaterials = true;
        this.activateTextures = true;

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        this.currMatId = [];
        this.currMat = 0;
        this.lights = [];
        this.spriteanims = [];
        this.initialInstant = 0;

        this.tiles = [];
        this.pieces = [];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
       
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse spritesheets block
             if ((error = this.parseSpritesheets(nodes[index])) != null)
                 return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {

        this.cameras = [];
        this.defaultViewId = this.reader.getString(viewsNode, 'default');
        this.viewMap = new Map();
        for (let i = 0; i < viewsNode.children.length; i++) {
            if (viewsNode.children[i].nodeName != "perspective" && viewsNode.children[i].nodeName != "ortho") {
                this.onXMLMinorError("Unknown camera tag <"+viewsNode.children[i].nodeName+">, ignoring");
                continue;
            }

            let camera = viewsNode.children[i];
            var fromX, fromY, fromZ, toX, toY, toZ, near, far, id;
            near = this.reader.getFloat(camera, 'near'); if(near == null){this.onXMLMinorError("bad reading for 'near' in '"+id+"' camera"); near =  0.1;}
            far = this.reader.getFloat(camera, 'far');if(far == null){this.onXMLMinorError("bad reading for 'far' in '"+id+"' camera"); far = 500;}

            let from = camera.children[0];
            fromX = this.reader.getFloat(from, 'x');
            fromY = this.reader.getFloat(from, 'y');
            fromZ = this.reader.getFloat(from, 'z');

            let to = camera.children[1];
            toX = this.reader.getFloat(to, 'x');
            toY = this.reader.getFloat(to, 'y');
            toZ = this.reader.getFloat(to, 'z');

            id = this.reader.getString(camera, 'id');
            if (viewsNode.children[i].nodeName == "perspective") {
                var angle;
                angle = this.reader.getFloat(camera, 'angle');

                this.cameras[i] = new CGFcamera(DEGREE_TO_RAD * angle, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ));
                this.viewMap.set(id, this.cameras[i]);
            }
            else if (viewsNode.children[i].nodeName == "ortho") {
                var left, right, top, bottom;

                let camera = viewsNode.children[i];
                left = this.reader.getFloat(camera, 'left');
                right = this.reader.getFloat(camera, 'right');
                top = this.reader.getFloat(camera, 'top');
                bottom = this.reader.getFloat(camera, 'bottom');

                let upVec = vec3.fromValues(0,1,0);
                if(camera.children.length < 3){
                    this.onXMLMinorError("no up axis defined for orthogonal camera '"+ id +"'; assuming (0,1,0)");
                }
                else{
                    let up = camera.children[2];
                    let upX = this.reader.getFloat(up,'x');
                    let upY = this.reader.getFloat(up,'y');
                    let upZ = this.reader.getFloat(up,'z');
                    upVec = vec3.fromValues(upX,upY,upZ);
                }
                
                this.cameras[i] = new CGFcameraOrtho(left, right, bottom, top, near, far, vec3.fromValues(fromX, fromY, fromZ), vec3.fromValues(toX, toY, toZ), upVec);
                this.viewMap.set(id, this.cameras[i]);
            }
        }   
        this.camera = this.viewMap.get(this.defaultViewId);
        if(this.camera == null)
            return "default camera not defined";

        this.log("Parsed cameras");

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);
                
                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL
        //this.onXMLMinorError("To do: Parse textures.");
        var children = texturesNode.children;

        if (children.length == 0) {
            return "at least one texture must be defined";
        }

        this.textures = [];
        var textId;
        var path;

        for (var i = 0; i < children.length; i++) {
            textId = this.reader.getString(children[i], 'id');
            if (textId == null || textId.length == 0) {
                return "A texture ID must be defined"
            }
            if (this.textures[textId] != null) {
                return textId + " already defined";
            }

            path = this.reader.getString(children[i], 'path');
            if (path == null || path.length == 0) {
                return "A path must be defined for texture " + textId;
            }

            if (path.includes('scenes/images')) {
                this.textures[textId] = new CGFtexture(this.scene, path);

            }
            else if (path.includes('images/')) {
                this.textures[textId] = new CGFtexture(this.scene, './scenes/' + path);
            }
            else {
                this.textures[textId] = new CGFtexture(this.scene, "./scenes/images/" + path);
            }

        }

        this.log("Parsed textures");

        return null;

    }

    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode) {

        //For each texture in spritesheets block, check ID and file URL
        var children = spritesheetsNode.children;

        // if (children.length == 0) {
        //     return "at least one spritesheet must be defined";
        // }

        this.spritesheets = [];
        var spriteId;
        var path;
        var sizeM;
        var sizeN;


        for (var i = 0; i < children.length; i++) {
            spriteId = this.reader.getString(children[i], 'id');
            if (spriteId == null || spriteId.length == 0) {
                return "A texture ID must be defined"
            }
            if (this.spritesheets[spriteId] != null) {
                return spriteId + " already defined";
            }

            path = this.reader.getString(children[i], 'path');
            if (path == null || path.length == 0) {
                return "A path must be defined for spritesheet " + spriteId;
            }

            sizeM = this.reader.getString(children[i], 'sizeM');
            if (sizeM == null || sizeM.length == 0) {
                return "A sizeM must be defined for spritesheet " + spriteId;
            }

            sizeN = this.reader.getString(children[i], 'sizeN');
            if (sizeN == null || sizeN.length == 0) {
                return "A sizeN must be defined for spritesheet " + spriteId;
            }

            if (path.includes('scenes/images')) {
                this.spritesheets[spriteId] = new MySpritesheet(this.scene, path,sizeM,sizeN);

            }
            else if (path.includes('images/')) {
                this.spritesheets[spriteId] = new MySpritesheet(this.scene, './scenes/' + path, sizeM, sizeN);
            }
            else {
                this.spritesheets[spriteId] = new MySpritesheet(this.scene, "./scenes/images/" + path, sizeM, sizeN);
            }

        }

        this.log("Parsed spritesheets");

        return null;

    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        
        if (children.length == 0) {
            return "at least one material must be defined";
        }

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            //this.onXMLMinorError("To do: Parse materials.");
            grandChildren = children[i].children;

            //Add tags to auxiliary variable
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //Verify if all tags exists
            if (nodeNames.indexOf("emissive") == -1) {
                return "missing <emissive> tag";
            }
            else if (nodeNames.indexOf("ambient") == -1) {
                return "missing <ambient> tag";
            }
            else if (nodeNames.indexOf("diffuse") == -1) {
                return "missing <diffuse> tag";
            }
            else if (nodeNames.indexOf("specular") == -1) {
                return "missing <specular> tag";
            }

            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName == "shininess") {
                    var shininess = this.reader.getFloat(grandChildren[j], 'value')
                    if (shininess == null) return "Missing shininess of " + grandChildren[j].nodeName;
                }
                else if (grandChildren[j].nodeName == "specular") {
                    var specular = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }

                    var aux = this.parseColor(grandChildren[j], "specular");
                    if (aux == null) return "Missing specular of " + grandChildren[j].nodeName;
                }
                else if (grandChildren[j].nodeName == "diffuse") {
                    var diffuse = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }
                    var aux = this.parseColor(grandChildren[j], "diffuse");
                    if (aux == null) return "Missing diffuse of " + grandChildren[j].nodeName;
                }
                else if (grandChildren[j].nodeName == "ambient") {
                    var ambient = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }

                    var aux = this.parseColor(grandChildren[j], "ambient");
                    if (aux == null) return "Missing ambient of " + grandChildren[j].nodeName;
                }
                else if (grandChildren[j].nodeName == "emissive") {
                    var emissive = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    }

                    var aux = this.parseColor(grandChildren[j], "emissive");
                    if (aux == null) return "Missing emissive of " + grandChildren[j].nodeName;
                }
                else {
                    this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                    continue;
                }
            }

            if(i == 0)
            {
                this.defaultMaterialID = materialID;
            }
            this.materials[materialID] = new CGFappearance(this.scene);
            this.materials[materialID].setShininess(shininess);
            this.materials[materialID].setEmission(emissive.red, emissive.green, emissive.blue, emissive.alpha);
            this.materials[materialID].setAmbient(ambient.red, ambient.green, ambient.blue, ambient.alpha);
            this.materials[materialID].setDiffuse(diffuse.red, diffuse.green, diffuse.blue, diffuse.alpha);
            this.materials[materialID].setSpecular(specular.red, specular.green, specular.blue, specular.alpha);
            this.materials[materialID].setTextureWrap('REPEAT', 'REPEAT');
            

            this.currMatId.push(materialID);
        }

        this.log("Parsed materials");
        return null;
    }

    parseAnimations(nodesNode)
    {
        this.keyframeAnimators = [];

        let animations = nodesNode.children;

        for(let i = 0; i < animations.length; i++)
        {
            if(animations[i].nodeName != "animation")
            {
                this.onXMLMinorError("unknown tag <"+ animations[i].nodeName + ">");
                continue;
            }

            let animationID = this.reader.getString(animations[i],"id");
            if(animationID == null)
            {
                this.onXMLMinorError("Missing id of animation");
                continue;
            }

            let keyframes = animations[i].children;
            let animationKeyframes = [];
            let lastInstant = -1;

            for(let j = 0; j < keyframes.length; j++)
            {
                if(keyframes[j].nodeName != "keyframe")
                {
                    this.onXMLMinorError("unknown tag <" + keyframes[j].nodeName + ">");
                    continue;
                }

                let keyframeInstant = this.reader.getFloat(keyframes[j], "instant");
                if(keyframeInstant == null || isNaN(keyframeInstant))
                {
                    this.onXMLMinorError("Missing instant of keyframe, will be ignored");
                    continue;
                }
                if(keyframeInstant <= lastInstant)
                {
                    return "Animation "+ animationID +" keyframes not declared in increasing order!";
                }

                let transformations = keyframes[j].children;
                let rotationsCount = 0;
                let translation = {};
                let scale = {};
                let rotation = {};
                for(let k = 0; k < transformations.length; k++)
                {
                    if(transformations[k].nodeName == "translation")
                    {
                        let t_x,t_y,t_z;
                        if(k != 0)
                            this.onXMLMinorError("In animation "+animationID+" keyframe "+keyframeInstant+" tag <translation> in wrong order "+k);
                        
                        t_x = this.reader.getFloat(transformations[k],"x");
                        if(t_x == null  || isNaN(t_x))
                            return "Unable to parse translation x in animation "+animationID+" keyframe "+keyframeInstant;

                        t_y = this.reader.getFloat(transformations[k],"y");
                        if(t_y == null  || isNaN(t_y))
                            return "Unable to parse translation y in animation "+animationID+" keyframe "+keyframeInstant;

                        t_z = this.reader.getFloat(transformations[k],"z");
                        if(t_z == null  || isNaN(t_z))
                            return "Unable to parse translation z in animation "+animationID+" keyframe "+keyframeInstant;
                    
                        translation = {x: t_x, y: t_y, z: t_z};
                    }
                    else if(transformations[k].nodeName == "rotation")
                    {
                        if(k != 1 && k != 2 && k != 3)
                            this.onXMLMinorError("In animation "+animationID+" keyframe "+keyframeInstant+" tag <rotation> in wrong order "+k);
                        
                        let axis = this.reader.getString(transformations[k],"axis");
                        let angle = this.reader.getFloat(transformations[k],"angle");

                        if(axis == null || (axis != 'x' && axis != 'y' && axis != 'z'))
                            return "Unable to parse axis in animation "+animationID+" keyframe "+keyframeInstant;
                        if(angle == null  || isNaN(angle))
                            return "Unable to parse angle in animation "+animationID+" keyframe "+keyframeInstant;
                        if(rotationsCount > 3)
                            return "Repeated rotation "+axis+"in animation "+animationID+" keyframe "+keyframeInstant;

                        rotation[axis] = angle;
                        rotationsCount++;                        
                    }
                    else if(transformations[k].nodeName == "scale")
                    {
                        if(k != 4)
                            this.onXMLMinorError("In animation "+animationID+" keyframe "+keyframeInstant+" tag <scale> in wrong order "+k);
                        let sx = this.reader.getFloat(transformations[k],"sx");
                        if(sx == null || isNaN(sx))
                            return "Unable to parse sx in animation "+animationID+" keyframe "+keyframeInstant;
                        scale['x'] = sx;

                        let sy = this.reader.getFloat(transformations[k],"sy");
                        if(sy == null  || isNaN(sy))
                            return "Unable to parse sx in animation "+animationID+" keyframe "+keyframeInstant;
                        scale['y'] = sy;

                        let sz = this.reader.getFloat(transformations[k],"sz");
                        if(sz == null || isNaN(sz))
                            return "Unable to parse sx in animation "+animationID+" keyframe "+keyframeInstant;
                        scale['z'] = sz;
                    }
                    else
                        this.onXMLMinorError("Unknown tag <"+transformations[k].nodeName+">");
                }

                if(Object.keys(translation).length == 0)
                    return "Missing tag <translation> in animation "+animationID+" keyframe "+keyframeInstant;
                if(Object.keys(rotation).length < 3)
                    return "Missing tag <rotation> in animation "+animationID+" keyframe "+keyframeInstant;
                if(Object.keys(scale).length == 0)
                    return "Missing tag <scale> in animation "+animationID+" keyframe "+keyframeInstant;

                let transformation = {
                    translation: translation,
                    rotation: rotation,
                    scale: scale
                };

                animationKeyframes[keyframeInstant] = transformation;


                lastInstant = keyframeInstant;
            }

            this.keyframeAnimators[animationID] = new KeyframeAnimator(animationKeyframes,this.scene);
        }
         return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.father = [];
        this.nodeInfo = [];
       

        var nodes = [];
        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];
        var nodeIDs = [];
        var material ;
        for (var i = 0; i < children.length; i++) {
            nodeIDs.push(this.reader.getString(children[i],'id'));
        }
        if(nodeIDs.indexOf(this.idRoot) == -1)
            return "root id not present";

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            let nodeChildren = [];
            let nodeID = nodeIDs[i];
            if (nodeID == null)
                return "no ID defined for nodeID";

            if(nodes[nodeID] != null)
            {
                this.onXMLMinorError("Repeated definition <" + children[i].nodeName + ">");
                continue;
            }

            nodes[nodeID] = nodeID;

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var animationrefIndex = nodeNames.indexOf("animationref");
            var clickableIndex = nodeNames.indexOf("clickable");

            var animationref = null;
            var picking_id = false;

            //this.onXMLMinorError("To do: Parse nodes.");

            if(grandChildren[clickableIndex] != null){
                picking_id = this.reader.getFloat(grandChildren[clickableIndex],"id");
            }

            if(grandChildren[animationrefIndex] != null && animationrefIndex != transformationsIndex+1)
                this.onXMLMinorError("Tag <animationref> must come immediately after tag <transformatios>!");
            else if(grandChildren[animationrefIndex] != null)
            {
                let animationrefID = this.reader.getString(grandChildren[animationrefIndex],"id");
                if(animationrefID == null)
                    this.onXMLMinorError("Could not parse id from animationref");
                else
                    animationref = animationrefID;
            }

            // Transformations
            if (grandChildren[transformationsIndex]==null)
            {
                continue;
            }
            else{
                var transformArray = mat4.create();
                grandgrandChildren = grandChildren[transformationsIndex].children;
                for (var k = 0; k < grandgrandChildren.length; k++) {
                    if (grandgrandChildren[k].nodeName == "translation") {
                        let translation = this.parseCoordinates3D(grandgrandChildren[k]," translation");
                        if(typeof translation === 'string')
                            return translation;

                        mat4.translate(transformArray, transformArray, translation);

                    }
                    else if (grandgrandChildren[k].nodeName == "rotation") {
                        var axis = this.reader.getString(grandgrandChildren[k], 'axis');
                        var angle = this.reader.getFloat(grandgrandChildren[k], 'angle') * DEGREE_TO_RAD;
                        if (axis == "xx" || axis == "x")
                        {
                            mat4.rotateX(transformArray, transformArray, angle );
                        }
                        else if (axis == "yy" || axis == "y")
                         {
                            mat4.rotateY(transformArray, transformArray, angle );
                         }
                        else if (axis == "zz" || axis == "z")
                        {
                            mat4.rotateZ(transformArray, transformArray, angle );
                        }
                        else
                        {
                            this.onXMLMinorError("error on reading axis of rotation on "+nodeID);
                        }
                    }  
                    else if (grandgrandChildren[k].nodeName == "scale") {
                        var x = this.reader.getFloat(grandgrandChildren[k], 'sx');
                        var y = this.reader.getFloat(grandgrandChildren[k], 'sy');
                        var z = this.reader.getFloat(grandgrandChildren[k], 'sz');
                        mat4.scale(transformArray,transformArray,[x,y,z]);
                    }
                    else {
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[k].nodeName + ">");
                        continue;
                    }
                }
           }
            
            // Material

            if(grandChildren[materialIndex] == null)
            {
                this.onXMLMinorError("Missing tag <material> for '"+nodeID+"'' assuming null");
            }
            else {            
                var materialID = this.reader.getString(grandChildren[materialIndex], 'id');

                    //Checks if the material exists
                    if (materialID == null) {
                        this.onXMLMinorError("Cant parse material of component " + nodeID);
                    }
                    //Checks if the material is created
                    if (materialID != "null" && this.materials[materialID] == null) {
                        this.onXMLMinorError("No material with ID " + materialID);
                    }
                    
                    material = materialID;
            }

            // Texture
            
            var texID = this.reader.getString(grandChildren[textureIndex], 'id');
            if (texID == null) {
                this.onXMLMinorError("Cant parse texture of component " + nodeID);
            }

            if (this.textures[texID] == null && texID != "null" && texID != "clear") {
                this.onXMLMinorError("No texture with ID " + texID);
            }
            grandgrandChildren = grandChildren[textureIndex].children;
            
            // Gets length_s and legth_t values from texture declaration
            if (texID != "null" && texID != "clear" )
            {
                var afs = this.reader.getFloat(grandgrandChildren[0], 'afs', false);
                var aft = this.reader.getFloat(grandgrandChildren[0], 'aft', false);  
            }
            else
            {
                afs = null;
                aft = null;
            }

            if ((texID == "clear" || texID == "null") && (afs != null || aft != null)) {
                this.onXMLMinorError("The texture " + texID + "cannot have length_s and length_t values.");
            }
            // Values them as 1 if they are null or 0 
            if ((afs == null || afs == 0) && texID != "null" && texID != "clear" ) {
                this.onXMLMinorError("The texture " + texID + "must have both amplification factors, afs was set to default.");
                afs = 1;
            }
            if ((aft == null || aft == 0) && texID != "null" && texID != "clear") {
                this.onXMLMinorError("The texture " + texID + "must have both amplification factors, aft was set to default.");
                aft = 1;
            }
            // Descendants
            if(grandChildren[descendantsIndex] == null)
            {
                return "Missing tag <descendants> for '"+nodeID+"''!";
            }
            else {            
                grandgrandChildren = grandChildren[descendantsIndex].children;

                for (var k = 0; k < grandgrandChildren.length; k++) {
                    if (grandgrandChildren[k].nodeName == "noderef") {
                        var refId = this.reader.getString(grandgrandChildren[k], 'id');
                        if (children[refId] == null) {
                            this.onXMLMinorError("node '" + refId + "' not defined");
                            continue;
                        }
                        else {
                            this.father[refId] = nodeID;
                            nodeChildren.push(refId);
                        }
                        
                    }
                    else if (grandgrandChildren[k].nodeName == "leaf") {
                        let type = this.reader.getString(grandgrandChildren[k],"type");
                        if(type === "rectangle")
                        {
                            let x1 = this.reader.getFloat(grandgrandChildren[k],"x1");
                            let x2 = this.reader.getFloat(grandgrandChildren[k],"x2");
                            let y1 = this.reader.getFloat(grandgrandChildren[k],"y1");
                            let y2 = this.reader.getFloat(grandgrandChildren[k],"y2");
                            let rectangle = new MyRectangle(this.scene,x1,y1,x2,y2);
                            nodeChildren.push(rectangle);
                        }
                        else if(type === "triangle")
                        {
                            let x1 = this.reader.getFloat(grandgrandChildren[k],"x1");
                            let x2 = this.reader.getFloat(grandgrandChildren[k],"x2");
                            let x3 = this.reader.getFloat(grandgrandChildren[k],"x3");
                            let y1 = this.reader.getFloat(grandgrandChildren[k],"y1");
                            let y2 = this.reader.getFloat(grandgrandChildren[k],"y2");
                            let y3 = this.reader.getFloat(grandgrandChildren[k],"y3");
                            let triangle = new MyTriangle(this.scene,x1,y1,x2,y2, x3, y3);
                            nodeChildren.push(triangle);
                        }
                        else if(type === "cylinder")
                        {
                            let height = this.reader.getFloat(grandgrandChildren[k],"height");
                            let topRadius = this.reader.getFloat(grandgrandChildren[k],"topRadius");
                            let bottomRadius = this.reader.getFloat(grandgrandChildren[k],"bottomRadius");
                            let stacks = this.reader.getFloat(grandgrandChildren[k],"stacks");
                            let slices = this.reader.getFloat(grandgrandChildren[k],"slices");
                            let cylinder = new MyCylinder(this.scene,height,topRadius,bottomRadius,stacks,slices);
                            nodeChildren.push(cylinder);
                        }
                        else if(type === "sphere")
                        {
                            let radius = this.reader.getFloat(grandgrandChildren[k],"radius");
                            let stacks = this.reader.getFloat(grandgrandChildren[k],"stacks");
                            let slices = this.reader.getFloat(grandgrandChildren[k],"slices");
                            let sphere = new MySphere(this.scene,radius,stacks,slices);
                            nodeChildren.push(sphere);
                        }
                        else if(type === "torus")
                        {
                            let inner = this.reader.getFloat(grandgrandChildren[k],"inner");
                            let outer = this.reader.getFloat(grandgrandChildren[k],"outer");
                            let slices = this.reader.getFloat(grandgrandChildren[k],"slices");
                            let loops = this.reader.getFloat(grandgrandChildren[k],"loops");
                            let torus = new MyTorus(this.scene,inner,outer,slices,loops);
                            nodeChildren.push(torus);
                        }
                        else if (type === "spritetext") {
                            let text = this.reader.getString(grandgrandChildren[k], "text");
                            let spritetext = new MySpriteText(this.scene, text);
                            nodeChildren.push(spritetext);
                        }
                        else if (type === "spriteanim") {
                            let ssid = this.reader.getString(grandgrandChildren[k], "ssid");
                            let startCell = this.reader.getFloat(grandgrandChildren[k], "startCell");
                            let endCell = this.reader.getFloat(grandgrandChildren[k], "endCell");
                            let duration = this.reader.getFloat(grandgrandChildren[k], "duration");
                            let spriteanim = new MySpriteAnimation(this.scene,ssid,startCell,endCell,duration);
                        
                            this.spriteanims[ssid] = spriteanim;
                            nodeChildren.push(spriteanim);
                        }
                        else if(type == "plane")
                        {
                            let npartsU = this.reader.getFloat(grandgrandChildren[k],"npartsU");
                            let npartsV = this.reader.getFloat(grandgrandChildren[k],"npartsV");

                            let plane = new MyPlane(this.scene, npartsU, npartsV);

                            nodeChildren.push(plane);
                        }
                        else if(type == "patch")
                        {
                            /*<leaf type="patch" npointsU="ii" npointsV="ii" npartsU="ii" npartsV="ii" >
                                <controlpoint xx="ff" yy="ff" zz="ff" />
                                    ...
                            </leaf>*/

                            let npointsU = this.reader.getFloat(grandgrandChildren[k],"npointsU");
                            let npointsV = this.reader.getFloat(grandgrandChildren[k],"npointsV");
                            let npartsU = this.reader.getFloat(grandgrandChildren[k],"npartsU");
                            let npartsV = this.reader.getFloat(grandgrandChildren[k],"npartsV");

                            let controlPoints = grandgrandChildren[k].children;
                            let controlVertexes = this.parseControlPoints(npointsU,npointsV, controlPoints);

                            let patch = new MyPatch(this.scene, npartsU, npartsV, npointsU-1, npointsV-1, controlVertexes);

                            nodeChildren.push(patch);
                        }
                        else if(type == "defbarrel")
                        {
                            //<leaf type=”defbarrel” base=“ff” middle=“ff” height=“ff” slices=“ii” stacks=“ii” />
                            let base = this.reader.getFloat(grandgrandChildren[k],"base");
                            let middle = this.reader.getFloat(grandgrandChildren[k],"middle");
                            let height = this.reader.getFloat(grandgrandChildren[k],"height");
                            let slices = this.reader.getFloat(grandgrandChildren[k],"slices");
                            let stacks = this.reader.getFloat(grandgrandChildren[k],"stacks");

                            let defbarrel = new MyDefbarrel(this.scene, base, middle, height, slices, stacks);

                            nodeChildren.push(defbarrel);
                        }
                        else if(type == "objmodel")
                        {
                            let model = this.reader.getString(grandgrandChildren[k],"model");

                            let wireframe = this.reader.getBoolean(grandgrandChildren[k], "wireframe");

                            let obj_model = new CGFOBJModel(this.scene, model, wireframe);

                            nodeChildren.push(obj_model);
                        }
                        else if(type == 'tile')
                        {
                            let id = this.reader.getString(grandgrandChildren[k],'id');

                            let tile = new MyTile(this.scene, id, this.materials['redMaterial'] || this.materials[this.defaultMaterialID] ,this.materials['transparentMaterial'] || this.materials[this.defaultMaterialID]);

                            this.tiles[id] = tile;

                            nodeChildren.push(tile);
                        }
                        else if(type == 'piece'){
                            let color = this.reader.getString(grandgrandChildren[k],'color');
                            let tileID = this.reader.getString(grandgrandChildren[k],'tileID');

                            let piece = new MyPiece(this.scene, tileID, color);

                            nodeChildren.push(piece);

                            this.pieces.push(piece);

                        }
                        else
                        {
                            this.onXMLMinorError("unknown type " + type);
                        }
                    }
                    else {
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[k].nodeName + "> in children of " + this.id);
                        continue;
                    }
                }
            }
            this.nodeInfo[nodeID] = new MyNode(this.scene, nodeID, material, texID, afs, aft, transformArray, nodeChildren, animationref, picking_id);
        }

    }


    parseControlPoints(npartsU, npartsV, controlPoints)
    {
        //<controlpoint xx="ff" yy="ff" zz="ff" />
        if(controlPoints.length !==  npartsU*npartsV)
            return "Wrong number of control points in patch";
        
        let controlvertexes = [];
        for(let i = 0; i < npartsU; i++)
        {
            let Us = [];
            for(let j = 0; j < npartsV; j++)
            {
                let xx = this.reader.getFloat(controlPoints[i*npartsV+j],"xx");
                let yy = this.reader.getFloat(controlPoints[i*npartsV+j],"yy");
                let zz = this.reader.getFloat(controlPoints[i*npartsV+j],"zz");

                Us.push([xx,yy,zz,1]);
            }
            controlvertexes.push(Us);
        }
        return controlvertexes;
    }

    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (
            !(
                boolVal != null &&
                !isNaN(boolVal) &&
                (boolVal == true || boolVal == false)
            )
        ) {
            this.onXMLMinorError(
                "unable to parse value component " +
                messageError +
                "; assuming 'value = 1'"
            );
            return true;

            }
            return boolVal;
        }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    displayNode(currNode,currMaterial,currTexture,amplification,picking_id)
    {
        this.scene.pushMatrix();
       
        this.scene.multMatrix(currNode.transformations);
        let display = true;
        if(currNode.animator != null)
        {
            display = this.keyframeAnimators[currNode.animator].apply();
            if(display)
                this.scene.multMatrix(display);
        }

        if(currNode.picking_id === -1)
            picking_id = false;
        else if(currNode.picking_id != false)
        {
            picking_id = currNode.picking_id;
        }

        if(currNode.material == "clear")
            currMaterial = this.defaultMaterialID;
        else if(currNode.material != "null")
            currMaterial = currNode.material;

        if(currNode.texture == "clear")
            currTexture = "null";
        else if(currNode.texture != "null")
        {
            amplification.s = currNode.l_s;
            amplification.t = currNode.l_t;
            currTexture = currNode.texture;
        }

        
        for(let i = 0; i < currNode.children.length; i++)
        {

            if(this.activateTextures && currTexture != "null")
            {
                this.updateTexCoords(amplification,currNode.children[i]);
                this.materials[currMaterial].setTexture(this.textures[currTexture]);
            }
            else
                this.materials[currMaterial].setTexture(null);

            if (this.activateMaterials)
                this.materials[currMaterial].apply();
            if(display)
            {
                if(typeof currNode.children[i] == "string")
                   this.displayNode(this.nodeInfo[currNode.children[i]],currMaterial,currTexture,amplification,picking_id);
                else
                {
                    if(picking_id != false)
                        this.scene.registerForPick(picking_id, currNode.children[i]);
                    currNode.children[i].display();
                    if(picking_id != false)
                        this.scene.clearPickRegistration();
                }
            }
        }
        this.scene.popMatrix();
    }

    updateTexCoords(amplification,primitive)
    {
        if(primitive instanceof MyRectangle)
        {
            primitive.updateTexCoords([
                        0,              1/amplification.t,
                1/amplification.s,      1/amplification.t,
                        0,                     0,
                1/amplification.s,             0
            ]);

        }
        else if(primitive instanceof MyTriangle)
        {
            let a = Math.sqrt(Math.pow(primitive.x2-primitive.x1,2)+Math.pow(primitive.y2-primitive.y1,2));
            let b = Math.sqrt(Math.pow(primitive.x3-primitive.x2,2)+Math.pow(primitive.y3-primitive.y2,2));
            let c = Math.sqrt(Math.pow(primitive.x1-primitive.x3,2)+Math.pow(primitive.y1-primitive.y3,2));

            let cosA = (Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2)) /(2*a*c);
            let sinA = Math.sqrt(1 - Math.pow(cosA,2));

            let t1 = {s: 0, t: 0};
            let t2 = {s: (a/amplification.s), t: 0};
            let t3 = {s: ((c*cosA)/amplification.s), t:((c*sinA)/amplification.t)};

            primitive.updateTexCoords([
                t1.s, t1.t,
                t2.s, t2.t,
                t3.s, t3.t
                ]);
        }   

    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        this.displayNode(this.nodeInfo[this.idRoot],this.defaultMaterialID,"null",{s:1,t:1},false);
    }

    update(t)
    {
        var time = (t - this.initialInstant) / 1000;
        for (var anim in this.spriteanims) {
            this.spriteanims[anim].update(t);
        }
        if (!this.initialInstant) {
            this.initialInstant = t;
        }
        else
        {
            for (let animationID in this.keyframeAnimators) {
                this.keyframeAnimators[animationID].update(time);
            }
        }
    }
}