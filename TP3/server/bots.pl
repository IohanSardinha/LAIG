%findAllDistances(PossibleMoves, OtherFishes, Distances, Accumulator).
findAllDistances([], _ ,[],_).

findAllDistances([[ToLine,ToColumn]], OtherFishes, Distances, Accumulator):-
    distanceSum(ToLine, ToColumn, OtherFishes, Sum),
    append(Accumulator, [Sum], Distances)
.

findAllDistances([[ToLine,ToColumn]|Tail], OtherFishes, Distances, Temp):-
    distanceSum(ToLine, ToColumn, OtherFishes, Sum),
    append(Temp,[Sum], Accumulator),
    findAllDistances(Tail, OtherFishes, Distances, Accumulator)
.
findAllDistances([[ToLine,ToColumn]|Tail], OtherFishes, Distances):-findAllDistances([[ToLine,ToColumn]|Tail], OtherFishes, Distances, []).

findAllOtherFishes(Board, FishLine, FishColumn, OtherFishes):-
    findall([X,Y], (at(Board, X, Y, r), [X,Y] \= [FishLine,FishColumn]), OtherFishesRed),
    findall([X,Y], (at(Board, X, Y, y), [X,Y] \= [FishLine,FishColumn]), OtherFishesYellow),
    append(OtherFishesRed,OtherFishesYellow,OtherFishes)
.

findAllPossibleMoves(Board, Line, Column, AllPossibleMoves):-
    findall([X,Y],(validWalk(Board,Line,Column,X,Y)),AllPossibleWalks),
    findall([X2,Y2],(validJump(Board,Line,Column,X2,Y2)),AllPossibleJumps),
    append(AllPossibleWalks,AllPossibleJumps,AllPossibleMoves)
.

%findAllMovesScores(Board, FromX, FromY, AllPossibleMoves, Scores, Accumulator)
findAllMovesScores(_, _, _ , [] , _, [] ).
findAllMovesScores(Board, FromX, FromY, [[ToX,ToY]], Scores, Accumulator):-
    at(Board, FromX, FromY, Value),
    replaceInMatrix(Board, FromX, FromY, empty, TempBoard),
    replaceInMatrix(TempBoard, ToX, ToY, Value, NewBoard),
    countFish(NewBoard, ToX, ToY, Score),
    append(Accumulator,[Score], Scores)
.
findAllMovesScores(Board, FromX, FromY, [[ToX,ToY]|Tail], Scores, Temp):-
    at(Board, FromX, FromY, Value),
    replaceInMatrix(Board, FromX, FromY, empty, TempBoard),
    replaceInMatrix(TempBoard, ToX, ToY, Value, NewBoard),
    countFish(NewBoard, ToX, ToY, Score),
    append(Temp,[Score], Accumulator),
    findAllMovesScores(Board, FromX, FromY, Tail, Scores, Accumulator)
.
findAllMovesScores(Board, FromX, FromY, [[ToX,ToY]|Tail], Scores):- findAllMovesScores(Board, FromX, FromY, [[ToX,ToY]|Tail], Scores, []).

%bestMove(+Board, +X, +Y, -BestMove, -Distance)
bestMove(Board, X, Y, BestMove, Distance):-
    findAllOtherFishes(Board, X, Y, OtherFishes),
    findAllPossibleMoves(Board, X, Y, AllPossibleMoves),
    findAllMovesScores(Board, X, Y, AllPossibleMoves, Scores),
    findAllDistances(AllPossibleMoves, OtherFishes, Distances),
    listSub(Distances, Scores, DistancesLessScores),
    min_member(SmallestDistance,DistancesLessScores),
    nth0(Index, DistancesLessScores, SmallestDistance),
    nth0(Index, Scores, Score),
    distanceSum(X,Y, OtherFishes, DistanceSum),
    Distance is DistanceSum + (Score*5),%5 = Score weight for choosing move
    nth0(Index, AllPossibleMoves, BestMove),!
.

bestMove(Board, Player, FromX, FromY, ToX, ToY):-
    findall([X,Y], at(Board, X, Y, Player), [[FromX,FromY],[SecondX,SecondY]]),
    
    bestMove(Board, FromX, FromY, [ToX, ToY], FirstDistance),
    bestMove(Board, SecondX, SecondY, [_,_], SecondDistance),
    FirstDistance > SecondDistance
.

bestMove(Board, Player, FromX, FromY, ToX, ToY):-
    findall([X,Y], at(Board, X, Y, Player), [[_,_],[FromX,FromY]]),
    bestMove(Board, FromX, FromY, [ToX, ToY], _ )
.

randomMove(Board, Player, FromLine, FromColumn, ToLine, ToColumn):-
    findall([X,Y], at(Board, X, Y, Player), PlayerFishes),
    random_member(PlayerFish, PlayerFishes),
    [FromLine,FromColumn] = PlayerFish,
    findAllPossibleMoves(Board, FromLine, FromColumn, AllPossibleMoves),
    random_member(Move, AllPossibleMoves),
    [ToLine, ToColumn] = Move
.

nextTurnBot(GameState, Player, Computer, NewBoard, Line, Column, 'ComputerVsComputer'):-
    write('Red is easy computer, Yellow is hard computer'),nl,
    write('Press anything to see next move...'),
    read_line(_),
    countFish(NewBoard, Line, Column, ScoreToAdd),
    addScore(GameState, Computer, ScoreToAdd, TempGameState),
    updateBoard(TempGameState, NewBoard, NewGameState),
    playerTurn(NewGameState, Player, 'ComputerVsComputer')
.

nextTurnBot(GameState, Player, Computer, NewBoard, Line, Column, GameMode):-
    write('Computer\'s turn , press anything to continue...'),
    read_line(_),
    countFish(NewBoard, Line, Column, ScoreToAdd),
    addScore(GameState,Computer,ScoreToAdd,TempGameState),
    updateBoard(TempGameState, NewBoard, NewGameState),
    playerTurn(NewGameState, Player, GameMode)
.

%choose_move(+GameState, +Player, +Level, -Move)
choose_move(GameState, Player, 'Easy', [FromX, FromY, ToX, ToY]):-
    board(GameState,Board),
    randomMove(Board, Player, FromX, FromY, ToX, ToY)
.
choose_move(GameState, Player, 'Hard', [FromX, FromY, ToX, ToY]):-
    board(GameState,Board),
    bestMove(Board, Player, FromX, FromY, ToX, ToY)
.