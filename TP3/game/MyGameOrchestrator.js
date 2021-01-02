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
        this.lastTime = this.lastTime || 0;
        this.deltaTime = time - this.lastTime;
        this.lastTime = time;
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
                    this.state = 'move piece';
                break;

            case 'move piece':
                let gameState = new MyGameState(this.prolog.parsedResult[0]);
                let gameMove = new MyGameMove(this.scene,this.fromTile.piece,this.fromTile,this.toTile);
                this.gameMoveStack.push(gameMove);
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
                    this.currPlayer = this.currPlayer == 'r' ? 'y' : 'r';
                    this.state = 'waiting select piece';
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
                    let stone;
                    if (this.currPlayer == 'r')
                    {
                        stone = this.gameboard.red_stones[this.gameboard.red_stones.length - 1]
                    }
                    else{
                        stone = this.gameboard.yellow_stones[this.gameboard.yellow_stones-1]
                    }
                    let gameMove = new MyGameMove(this.scene, stone, null, this.toTile);
                    this.gameMoveStack.push(gameMove);
                    this.gameboard.gameState = this.prolog.parsedResult;
                    this.gameboard.dropStone(this.currPlayer, this.toTile);
                    this.gameStateStack.push(this.prolog.parsedResult);
                    this.currPlayer = this.currPlayer == 'r' ? 'y' : 'r';
                    this.state = 'waiting select piece';
                }
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
        if(nGameState >1)
            {
                console.log('UndoMove');
                let gameMove = this.gameMoveStack.pop();
                this.gameStateStack.pop();
                this.gameboard.gameState = this.gameStateStack[nGameState-2];
                if(gameMove.movedPiece instanceof MyPiece)
                    {
                        this.gameboard.movePiece(gameMove.DestinationTile, gameMove.originTile);
                        this.state = 'waiting select piece';
                    }
                else
                    {
                        this.currPlayer = this.currPlayer == 'r' ? 'y' : 'r';
                        this.gameboard.removeStone(this.currPlayer);
                        this.prolog.sendValidDrops(this.gameboard.gameState);
                        this.state = 'waiting drop tiles result';
                        
                    }
                this.score.updateScore(this.gameboard.getScore());
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