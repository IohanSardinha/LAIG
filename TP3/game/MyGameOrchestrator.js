/*
Manages the entire game:
    • Load of new scenes
    • Manage gameplay (game states)
    • Manages undo•Manages movie play
    • Manage object selection
*/

class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator();
        this.gameboard = new MyGameBoard();
        this.theme = new MySceneGraph('jinli.xml', scene);
        this.prolog = new MyPrologInterface();

        this.prolog.testConnection();

        this.displayMenu = false;
        //this.startGame(1, 1, 'Player vs. Player');
        this.initGame = false;
        this.level = 1;
        this.modes = ['Player vs. Player', 'Player vs. CPU', 'CPU vs. CPU'];
        this.mode = 'Player vs. CPU';
        this.menu = new Menu(this, scene, this.level, this.mode);
        this.score = new ScoreClock(this.scene, this.level);
        this.gameStateStack = [];
        this.gameMoveStack = [];
        this.gameMove;
        this.winningScore = 10;

        this.state = 'start';
        this.currPlayer = 'r';
    }

    onGraphLoaded() {
        this.gameboard.setTiles(this.theme.tiles);
        this.gameboard.setPieces(this.theme.pieces);
        this.score.setLevel(this.level);
        this.gameboard.red_stones = this.theme.red_stones;
        this.gameboard.placed_red_stones = [];
        this.gameboard.yellow_stones = this.theme.yellow_stones;
        this.gameboard.placed_yellow_stones = [];
    }

    startGame(ambient, level, game_mode) {
        this.level = level;
        this.mode = game_mode;

        let filename;
        switch (ambient) {
            case 1:
                filename = "jinli.xml";
                break;
            case 2:
                filename = "jinli.xml";
                break;
            default:
                filename = "menu.xml";
                break;
        }
        this.scene.sceneInitiated = false;
        this.displayMenu = false;

        this.theme = new MySceneGraph(filename, this.scene);
    }

    update(time) {

        this.initialTime = this.initialTime || time;
        this.lastTime = this.lastTime || 0;
        this.deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.secsFromStart = (time - this.initialTime)/1000; 

        switch (this.state) {
            case 'start':
                this.prolog.testConnection();
                this.state = 'testing connection';
                break;

            case 'testing connection':
                if (this.prolog.connectionStablished === true)
                    this.state = 'connected';
                if (this.prolog.connectionStablished === false)
                    this.state = 'connection error';
                break;

            case 'connection error':
                alert('Could not connect to server');
                this.state = 'broken';
                break;

            case 'connected':
                this.prolog.sendInitial();
                this.state = 'waiting initial';
                break;

            case 'waiting initial':
                if (this.prolog.requestReady)
                    this.state = 'initial parsed';
                break;

            case 'initial parsed':
                this.displayMenu = true;
                this.gameboard.gameState = this.prolog.parsedResult;
                this.gameStateStack.push(this.prolog.parsedResult);
                this.state = 'waiting select piece';
                break;

            case 'waiting select piece':
                break;

            case 'waiting valid moves':
                this.state = this.prolog.requestReady ? 'received valid moves' : 'waiting valid moves';
                break;

            case 'received valid moves':
                this.gameboard.selectTiles(this.prolog.parsedResult);
                this.state = 'waiting move tile';
                break;

            case 'waiting move tile':
                break;

            case 'waiting move result':
                if (this.prolog.requestReady)
                {

                    let start = {
                            translation: {x:0, y:0, z:0},
                            rotation:    {x:0, y:0, z:0},
                            scale:       {x:1, y:1, z:1}
                        }; 

                    let middle = {
                        translation: {
                            x: (this.currPlayer == 'r' ?  1: -1) * 50*(this.toTile.column - this.fromTile.column), 
                            y: 100, 
                            z: (this.currPlayer == 'r' ?  1: -1) * 50*(this.toTile.line - this.fromTile.line)
                        },
                        rotation:    {x:0, y:0, z:45},
                        scale:       {x:1, y:1, z:1}
                    }; 


                    let end = {
                        translation: {
                            x: (this.currPlayer == 'r' ?  1: -1) * 100*(this.toTile.column - this.fromTile.column), 
                            y: 0, 
                            z: (this.currPlayer == 'r' ?  1: -1) * 100*(this.toTile.line - this.fromTile.line)
                        },
                        rotation:    {x:0, y:0, z:0},
                        scale:       {x:1, y:1, z:1}
                    }; 

                    let frames = [];
                    frames[this.secsFromStart] = start;
                    frames[this.secsFromStart+0.3] = middle;
                    frames[this.secsFromStart+0.6] = end;

                    this.animator = new KeyframeAnimator(frames, this.scene);
                    this.fromTile.piece.animator = this.animator;

                    this.state = 'animating moving';
                }
                break;

            case 'animating moving':
                this.animator.update(this.secsFromStart);
                if(this.animator.ended)
                    this.state = 'move piece';
                
                break;

            case 'move piece':
                this.animator = null;
                this.fromTile.piece.animator = null;
                let gameState = new MyGameState(this.prolog.parsedResult[0]);
                this.gameMove = new MyGameMove(this.scene,this.fromTile.piece,this.fromTile,this.toTile);
                this.gameMoveStack.push(this.gameMove);
                this.gameStateStack.push(gameState);
                this.gameboard.gameState = gameState;
                this.gameboard.movePiece(this.fromTile, this.toTile);
                this.score.updateScore(this.gameboard.getScore());

                if(gameState.getScore(this.currPlayer) >= this.winningScore){
                    this.state = 'game over';
                }
                else if(this.prolog.parsedResult[1] == 'walk' && gameState.getStones(this.currPlayer) > 0)
                {
                    this.prolog.sendValidDrops(this.gameboard.gameState);
                    this.state = 'waiting drop tiles result';
                }
                else{
                    this.state = 'next turn';
                }
                break;

            case 'waiting drop tiles result':
                if(this.prolog.requestReady)
                {
                    this.gameboard.selectTiles(this.prolog.parsedResult);
                    this.state = 'waiting drop tile click';
                }
                break;

            case 'waiting drop tile click':
                break;

            case 'waiting drop stone result':
                if(this.prolog.requestReady)
                {
                    let start = {
                        translation: {x:0, y:0, z:0},
                        rotation:    {x:0, y:0, z:0},
                        scale:       {x:1, y:1, z:1}
                    }; 

                    let stone_position = this.gameboard.getStonePosition(this.currPlayer);
                    
                    let middle = {
                        translation: {
                            x: (stone_position[0] + ((this.toTile.line-1)*3.85))/2, 
                            y: 30, 
                            z: (stone_position[2] - ((this.toTile.column-1)*3.85))/2
                        },
                        rotation:    {x:0, y:0, z:0},
                        scale:       {x:1, y:1, z:1}
                    }; 


                    let end = {
                        translation: {
                            x: stone_position[0] + ((this.toTile.line-1)*3.85), 
                            y: 0, 
                            z: stone_position[2] - ((this.toTile.column-1)*3.85)
                        },
                        rotation:    {x:0, y:0, z:0},
                        scale:       {x:1, y:1, z:1}
                    }; 

                    let frames = [];
                    frames[this.secsFromStart] = start;
                    frames[this.secsFromStart+0.3] = middle;
                    frames[this.secsFromStart+0.6] = end;

                    this.animator = new KeyframeAnimator(frames, this.scene);
                    this.gameboard.setStoneAnimator(this.currPlayer, this.animator);

                    this.state = 'animating drop';
                }
                break;

            case 'animating drop':
                this.animator.update(this.secsFromStart);
                if(this.animator.ended)
                    this.state = 'drop stone';
                break;

            case 'drop stone':
                let stone;
                if (this.currPlayer == 'r')
                {
                    stone = this.gameboard.red_stones[this.gameboard.red_stones.length - 1]
                }
                else{
                    stone = this.gameboard.yellow_stones[this.gameboard.yellow_stones.length-1]
                }
                this.gameMove = new MyGameMove(this.scene, stone, null, this.toTile);
                this.gameMoveStack.push(this.gameMove);
                this.gameboard.gameState = this.prolog.parsedResult;
                this.gameboard.dropStone(this.currPlayer, this.toTile);
                this.gameStateStack.push(this.prolog.parsedResult);
                this.state = 'next turn';
                break;

            case 'next turn':
                this.rotationTime = 0;
                this.Camerarotation=0;
                this.state = 'rotating camera';
                break;

            case 'rotating camera':
                let endRotationTime = 2;
                if(this.rotationTime < endRotationTime)
                {
                    this.Camerarotation += Math.PI/endRotationTime*this.deltaTime/1000;
                    this.scene.camera.orbit([0,1,0], Math.PI/endRotationTime*this.deltaTime/1000);
                    this.rotationTime += this.deltaTime/1000;
                }
                else{
                    this.currPlayer = this.currPlayer == 'r' ? 'y' : 'r';
                    this.state = 'waiting select piece';
                    this.scene.camera.orbit([0,1,0], Math.PI - this.Camerarotation);
                    console.log(this.Camerarotation);
                    console.log(this.scene.camera);
                }
                break;
            case 'undo move':
                let nGameState = this.gameStateStack.length;
                this.gameMove = this.gameMoveStack.pop();
                this.gameStateStack.pop();
                this.gameboard.gameState = this.gameStateStack[nGameState - 2];
                if (this.gameMove.movedPiece instanceof MyPiece) {
                    this.gameboard.movePiece(this.gameMove.DestinationTile, this.gameMove.originTile);
                    this.gameboard.unselectAllTiles();
                    this.state = 'waiting select piece';
                }
                else {
                    this.currPlayer = this.currPlayer == 'r' ? 'y' : 'r';
                    this.gameboard.removeStone(this.currPlayer);
                    let end = {
                        translation: { x: 0, y: 0, z: 0 },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1, y: 1, z: 1 }
                    };

                    let stone_position = this.gameboard.getStonePosition(this.currPlayer);

                    let middle = {
                        translation: {
                            x: (stone_position[0] + ((this.toTile.line - 1) * 3.85)) / 2,
                            y: 30,
                            z: (stone_position[2] - ((this.toTile.column - 1) * 3.85)) / 2
                        },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1, y: 1, z: 1 }
                    };


                    let start = {
                        translation: {
                            x: stone_position[0] + ((this.toTile.line - 1) * 3.85),
                            y: 0,
                            z: stone_position[2] - ((this.toTile.column - 1) * 3.85)
                        },
                        rotation: { x: 0, y: 0, z: 0 },
                        scale: { x: 1, y: 1, z: 1 }
                    };

                    let frames = [];
                    frames[this.secsFromStart] = start;
                    frames[this.secsFromStart + 0.3] = middle;
                    frames[this.secsFromStart + 0.6] = end;

                    this.animator = new KeyframeAnimator(frames, this.scene);
                    this.gameboard.setStoneAnimator(this.currPlayer, this.animator);
                    this.prolog.sendValidDrops(this.gameboard.gameState);
                    this.state = 'waiting drop tiles result';

                }
                this.score.updateScore(this.gameboard.getScore());
                break;
            case 'game over':
                alert((this.currPlayer == 'r' ? 'Red Player': 'Yellow Player')+' won!!');
                location = location;
                break;

        }

        if (!this.displayMenu) {
            if (this.sceneInited) {
                if (!this.initGame) {
                    let mode;
                    for (let i = 0; i < this.modes.length; i++) {
                        if (this.modes[i] === this.mode) {
                            mode = i + 1;
                            break;
                        }
                    }
                    this.initGame = true;
                }
            }  
            //console.log(this.deltaTime);
            this.score.updateTime(this.deltaTime,this.currPlayer);
        }  
        
        this.theme.update(time);
        this.checkKeys();
    }

    display() {
        //...

        this.theme.displayScene();
        this.score.display();
        if (this.displayMenu) {
            this.menu.display();
        }
        else {
            this.managePick(this.scene.pickMode, this.scene.pickResults);
        }
        //this.gameboard.display();
        //this.animator.display();
        //...
    }
    checkKeys() {
        if (this.scene.gui.isKeyPressed("Escape") || this.scene.gui.isKeyPressed("KeyM")) {
            this.menu.toggleMenu();
        }
        if (this.scene.gui.isKeyPressed("KeyR")) {
            this.undoMove();
        }
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */)
            if (results != null && results.length > 0)  // any results? 
            {
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0]; // get object from result
                    if (obj)  // exists? 
                    {
                        var uniqueId = results[i][1] // get idt
                        this.onObjectSelected(obj, uniqueId);
                    }
                }

                // clear results 

                results.splice(0, results.length);
            }
    }
    
    undoMove()
    {
        let nGameState = this.gameStateStack.length;
        if (nGameState > 1 && this.state != 'rotating camera')
            {
                this.state = 'undo move';
            }
        else this.currPlayer = 'r';

    }

    onObjectSelected(obj, id) {

        if (obj instanceof MyPiece) {

            switch (this.state) {
                case 'waiting select piece':
                    if (obj.color == this.currPlayer) {
                        this.prolog.sendValidMoves(this.gameboard.gameState, obj.tile.line, obj.tile.column);
                        this.state = 'waiting valid moves';
                        this.fromTile = obj.tile;
                    }
                    break;

                case 'waiting move tile':    
                    this.gameboard.unselectAllTiles();
                    this.state = 'waiting select piece';
                    
                    break;
            }

        }
        else if (obj instanceof MyTile) {
            switch (this.state) {
                case 'waiting select piece':
                    if (obj.hasPlayer(this.currPlayer)) {
                        this.prolog.sendValidMoves(this.gameboard.gameState, obj.line, obj.column);
                        this.state = 'waiting valid moves';
                        this.fromTile = obj;
                    }
                    break;

                case 'waiting move tile':
                    if (obj.selected) {
                        this.prolog.sendMove(this.gameboard.gameState, this.currPlayer, this.fromTile.line, this.fromTile.column, obj.line, obj.column);
                        this.gameboard.unselectAllTiles();
                        this.state = 'waiting move result';
                        this.toTile = obj;
                    }
                    else{
                        this.gameboard.unselectAllTiles();
                        this.state = 'waiting select piece';
                    }
                    break;

                case 'waiting drop tile click':
                    if(obj.selected)
                    {
                        this.prolog.sendDropStone(this.gameboard.gameState, this.currPlayer, obj.line, obj.column);
                        this.gameboard.unselectAllTiles();
                        this.state = 'waiting drop stone result';
                        this.toTile = obj;

                    }
                    break;
            }
        }
        else if (obj instanceof MyUndoButton) {
            this.undoMove();
        }
        else {
            console.log("Picked object of type: " + obj.constructor.name + ", with pick id " + id);
            console.log(obj);
        }
    }

}