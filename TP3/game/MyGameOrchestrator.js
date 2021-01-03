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
        this.theme = new MySceneGraph('mountain.xml', scene);
        this.prolog = new MyPrologInterface();

        this.prolog.testConnection();

        this.displayMenu = false;
        this.initGame = false;
        this.level = 1;
        this.modes = ['Player vs. Player', 'Player vs. CPU', 'CPU vs. CPU'];
        this.mode = 'Player vs. CPU';
        this.ambient = 1;
        this.menu = new Menu(this, scene, this.level, this.mode);
        this.score = new ScoreClock(this.scene, this.level);
        this.gameMove;
        this.winningScore = 10;

        this.redPlayerMode = 'Human';
        this.yellowPlayerMode = 'Hard';

        this.state = 'start';
        this.currPlayer = 'r';
    }

    onGraphLoaded() {
        this.state = 'start';
        this.gameboard.setTiles(this.theme.tiles);
        this.gameboard.setPieces(this.theme.pieces);
        this.score.setLevel(this.level);
        this.gameboard.red_stones = this.theme.red_stones;
        this.gameboard.placed_red_stones = [];
        this.gameboard.yellow_stones = this.theme.yellow_stones;
        this.gameboard.placed_yellow_stones = [];
        this.gameSequence.moveStack = [];
        this.gameStateStack = [];
    }

    changeAmbient()
    {   
        if(this.ambient != this.menu.ambient)
        {
            if(this.menu.ambient == 1)
            {
                this.theme = new MySceneGraph('mountain.xml', this.scene);
                this.ambient = 1;
            }
            if (this.menu.ambient == 2){
                this.theme = new MySceneGraph('lake.xml', this.scene);
                this.ambient = 2;
            }
            else{
                this.theme = new MySceneGraph('mountain.xml', this.scene);
                this.ambient = 1;
            }
        }
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
            {
                let playerMode = this.currPlayer == 'r' ? this.redPlayerMode : this.yellowPlayerMode;
                if(playerMode != 'Human'){
                    this.prolog.sendMoveBot(this.gameboard.gameState, this.currPlayer, playerMode);
                    this.state = 'waiting move bot results';
                }
                break;
            }

            case 'waiting valid moves':
                this.state = this.prolog.requestReady ? 'received valid moves' : 'waiting valid moves';
                break;

            case 'received valid moves':
                console.log(this.prolog.parsedResult);
                this.gameboard.selectTiles(this.prolog.parsedResult);
                this.state = 'waiting move tile';
                break;

            case 'waiting move tile':
                
                break;

            case 'waiting move result':
                if (this.prolog.requestReady)
                {
                    this.fromTile.piece.setAnimator(this.toTile, this.fromTile, this.secsFromStart);
                    this.state = 'animating moving';
                }
                break;

            case 'animating moving':
                if(!this.fromTile.piece.animate(this.secsFromStart))
                    this.state = 'move piece';
                break;

            case 'move piece':
                this.fromTile.piece.animator = null;
                let gameState = new MyGameState(this.prolog.parsedResult[0]);
                this.gameMove = new MyGameMove(this.scene,this.fromTile.piece,this.fromTile,this.toTile);
                this.gameSequence.addMove(this.gameMove);
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
                    this.state = 'set camera to rotate';
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
                    this.gameboard.setStoneAnimator(this.scene, this.secsFromStart, this.currPlayer, this.dropTile);

                    this.state = 'animating drop';
                }
                break;

            case 'animating drop':
                if(!this.gameboard.animateStone(this.currPlayer,this.secsFromStart))
                    this.state = 'drop stone';
                break;

            case 'drop stone':
                let stone;
                if (this.currPlayer == 'r') {
                    stone = this.gameboard.red_stones[this.gameboard.red_stones.length - 1]
                }
                else {
                    stone = this.gameboard.yellow_stones[this.gameboard.yellow_stones.length - 1]
                }
                this.gameMove = new MyGameMove(this.scene, stone, null, this.dropTile);
                this.gameSequence.addMove(this.gameMove);
                this.gameboard.gameState = this.prolog.parsedResult;
                this.gameboard.dropStone(this.currPlayer, this.dropTile);
                this.gameStateStack.push(this.prolog.parsedResult);
                this.state = 'set camera to rotate';
                break;

            case 'set camera to rotate':
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
                    this.scene.camera.orbit([0,1,0], Math.PI - this.Camerarotation);
                    this.state = 'next turn';
                }
                break;
            case 'undo move':
                let nGameState = this.gameStateStack.length;
                this.gameMove = this.gameSequence.undoMove();
                this.gameStateStack.pop();
                this.gameboard.gameState = this.gameStateStack[nGameState - 2];
                if (this.gameMove.movedPiece instanceof MyPiece) {
                    let [angle, _angMultX] = this.gameMove.movedPiece.calculateAngle(this.gameMove.originTile,this.gameMove.DestinationTile );
                    this.gameMove.movedPiece.angle = angle;
                    this.gameboard.movePiece(this.gameMove.DestinationTile, this.gameMove.originTile);
                    this.gameboard.unselectAllTiles();
                    this.state = 'waiting select piece';
                }
                else {
                    this.currPlayer = this.currPlayer == 'r' ? 'y' : 'r';
                    this.scene.camera.orbit([0, 1, 0], Math.PI);
                    this.gameboard.removeStone(this.scene,this.currPlayer, this.secsFromStart);
                    this.prolog.sendValidDrops(this.gameboard.gameState);
                    this.state = 'waiting drop tiles result';

                }
                this.score.updateScore(this.gameboard.getScore());
                break;
            case 'next turn':
                    let playerMode = this.currPlayer == 'r' ? this.redPlayerMode : this.yellowPlayerMode;
                    if(playerMode ==  'Human')
                        this.state = 'waiting select piece';
                    else
                    {
                        this.prolog.sendMoveBot(this.gameboard.gameState, this.currPlayer, playerMode);
                        this.state = 'waiting move bot results';
                    }
                break;

                case 'waiting move bot results':
                    if(this.prolog.requestReady){

                        let gameState = new MyGameState(this.prolog.parsedResult[0]);

                        console.log(gameState.toString());

                        this.gameboard.gameState = gameState;
                        this.gameStateStack.push(gameState);
                        let move = this.prolog.parsedResult[1];
                        this.fromTile = this.gameboard.getTileByPosition(move[0],move[1]);
                        this.toTile = this.gameboard.getTileByPosition(move[2],move[3]);
                        this.gameMove = new MyGameMove(this.scene, this.fromTile.piece, this.fromTile, this.toTile);
                        this.gameSequence.addMove(this.gameMove);
                        let dropPosition = this.prolog.parsedResult[2];
                        this.dropTile = dropPosition ? this.gameboard.getTileByPosition(dropPosition[0],dropPosition[1]) : null;
                        // this.gameMove = new MyGameMove(this.scene, this.dropTile.piece, null, this.dropTile);
                        // this.gameSequence.addMove(this.gameMove);
                        this.fromTile.piece.setAnimator(this.toTile, this.fromTile, this.secsFromStart);
                        this.state = 'animating bot move';
                    }
                    break;

                case 'animating bot move':
                    if(!this.fromTile.piece.animate(this.secsFromStart))
                    {
                        this.fromTile.piece.animator = null;

                        this.gameboard.movePiece(this.fromTile, this.toTile);
                        
                        this.score.updateScore(this.gameboard.getScore());
                        
                        if(this.dropTile == null){
                            this.state = 'set camera to rotate';
                        }
                        else{
                            this.gameboard.setStoneAnimator(this.scene, this.secsFromStart, this.currPlayer, this.dropTile);   
                            this.state = 'animating bot drop';
                        }
                    }
                    break;

                case 'animating bot drop':
                    if(!this.gameboard.animateStone(this.currPlayer,this.secsFromStart))
                    {
                        this.gameboard.dropStone(this.currPlayer, this.dropTile);
                        this.gameboard.gameState = this.prolog.parsedResult;
                        this.gameStateStack.push(this.prolog.parsedResult);
                        this.state = 'set camera to rotate';
                    }
                    break;

            case 'game over':
                alert((this.currPlayer == 'r' ? 'Red Player': 'Yellow Player')+' won!!');
                location = location;
                break;

        }

        if (!this.displayMenu) {
            // if (this.sceneInited) {
            //     if (!this.initGame) {
            //         let mode;
            //         for (let i = 0; i < this.modes.length; i++) {
            //             if (this.modes[i] === this.mode) {
            //                 mode = i + 1;
            //                 break;
            //             }
            //         }
            //         this.initGame = true;
            //     }
            // }  
            this.score.updateTime(this.deltaTime, this.currPlayer);
           
        }  
        this.theme.update(time);
        this.checkKeys();
    }

    display() {
        this.theme.displayScene();
        this.score.display();
        if (this.displayMenu) {
            this.menu.display();
        }
        else {
            this.managePick(this.scene.pickMode, this.scene.pickResults);
        }
    }

    checkKeys() {
        if (this.scene.gui.isKeyPressed("Escape") || this.scene.gui.isKeyPressed("KeyM")) {
            if (this.state != 'rotating camera')
            this.menu.toggleMenu();
        }
        if (this.scene.gui.isKeyPressed("KeyR")) {
            this.undoMove();
        }  
        if (this.scene.gui.isKeyPressed("KeyS")) {
            console.log(this.gameSequence);
            console.log(this.gameStateStack);
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
        if (nGameState > 1 && this.state != 'rotating camera' && this.state != 'animating moving' && this.state != 'animating drop')
            {
                this.state = 'undo move';
            }
        else this.currPlayer = 'r';

    }

    // calculateAngle(from,to)
    // {
    //     let angle = 0;
    //     let angMultX = 0;
    //     if (from.line == to.line)
    //     {
    //         if (from.column < to.column)
    //         {
    //             angle = 90;
    //             angMultX = - 1 * (from.column - to.column);
    //         }
    //         else{
    //             angle = 270;
    //             angMultX = 1 * (from.column - to.column);
    //         }
    //     }
    //     else if (from.column == to.column)
    //     {
    //         if (from.line < to.line) {
    //             angle = 0;
    //             angMultX = -1 * (from.line - to.line);
    //         }
    //         else {
    //             angle = 180;
    //             angMultX = 1 * (from.line - to.line);
    //         }
    //     }
    //     else if (from.column == to.column) {
    //         if (from.line < to.line) {
    //             angle = 0;
    //             angMultX = -1 * (from.line - to.line);
    //         }
    //         else {
    //             angle = 180;
    //             angMultX = 1 * (from.line - to.line);
    //         }
    //     }
    //     else if (from.column < to.column) {
    //         if (from.line < to.line) {
    //             angle = 45;
    //             angMultX = -1 * (from.line - to.line);
    //         }
    //         else {
    //             angle = 135;
    //             angMultX = 1 * (from.line - to.line);
    //         }
    //     }
    //     else if (from.column > to.column) {
    //         if (from.line > to.line) {
    //             angle = 225;
    //             angMultX = 1 * (from.line - to.line);
    //         }
    //         else {
    //             angle = 315;
    //             angMultX = -1 * (from.line - to.line);
    //         }
    //     }
        
        
    //     return [angle,angMultX];
    // }

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
                        this.dropTile = obj;
                        this.prolog.sendDropStone(this.gameboard.gameState, this.currPlayer, obj.line, obj.column);
                        this.gameboard.unselectAllTiles();
                        this.state = 'waiting drop stone result';

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