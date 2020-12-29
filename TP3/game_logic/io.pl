%displayGame(+GameState,+Player)
%Display the given state of the game and the current turn player
displayGame(GameState,Player) :-
    displayHeader(GameState,Player),
    board(GameState,Board),
    displayBoard(Board)
.

displayStones(10):-     format("#  Stones: 10                                           #",[]),nl.
displayStones(Stones):- format("#  Stones: ~w                                            #",Stones),nl.
displayScore(RedScore, 10):-         format("#  Red:    ~w     Yellow: 10                             #",[RedScore]),nl.
displayScore(10, YellowScore):-      format("#  Red:    10     Yellow: ~w                             #",[YellowScore]),nl.
displayScore(RedScore, YellowScore):-format("#  Red:    ~w     Yellow: ~w                              #",[RedScore,YellowScore]),nl.


displayHeader(GameState,Player):-
    value(GameState,r,RedScore),
    value(GameState,y,YellowScore),
    stones(Player, GameState, Stones),
    write('#########################################################'),nl,
    displayTurn(Player),
    displayStones(Stones),
    displayScore(RedScore, YellowScore),
    write('#########################################################'),nl
.

displayTurn(y) :- write('#  YELLOW\'S TURN                                        #'),nl.
displayTurn(r) :- write('#  RED\'S TURN                                           #'),nl.

displayBoard(Board):-
    write('#           _______________________________             #\n'),
    write('#          |   | 1 | 2 | 3 | 4 | 5 | 6 | 7 |            #\n'),
    write('#          |---|---|---|---|---|---|---|---|            #\n'),
    printLines(Board, 1),
    write('#                                                       #'),nl,
    write('#########################################################'),nl
.

printLines([],8).
printLines([FirstLine|BoardLeftover], N):-
    letter(N,LineLetter),
    nth0(0,FirstLine,P0),
    nth0(1,FirstLine,P1),
    nth0(2,FirstLine,P2),
    nth0(3,FirstLine,P3),
    nth0(4,FirstLine,P4),
    nth0(5,FirstLine,P5),
    nth0(6,FirstLine,P6),
    letter(P0,L0),
    letter(P1,L1),
    letter(P2,L2),
    letter(P3,L3),
    letter(P4,L4),
    letter(P5,L5),
    letter(P6,L6),

    format('#          | ~w | ~w | ~w | ~w | ~w | ~w | ~w | ~w |            #\n',[LineLetter,L0,L1,L2,L3,L4,L5,L6]),
    write('#          |---|---|---|---|---|---|---|---|            #\n'),
    N1 is N + 1,
    printLines(BoardLeftover, N1)   
.

%readPlayerFromPosition(+Player, -Line, -Column)
readPlayerFromPosition(Board, Player, Line, Column) :-
    write('From (Ex: A1): '), 
    read_line(Input),
    nth0(0,Input,Linetemp),
    letter(Line,Linetemp),
    nth0(1,Input,Columntemp),
    letter(Column,Columntemp),
    at(Board, Line, Column, Player)
.

readPlayerFromPosition(Board, Player, Line, Column) :-
    write('Player not in given position!\n'),
    readPlayerFromPosition(Board,Player,Line,Column) 
.

%readPlayerToPosition(-Line, -Column)
readPlayerToPosition(Line,Column) :-
    write('To   (Ex: B2): '), 
    read_line(Input),
    nth0(0,Input,Linetemp),
    letter(Line,Linetemp),
    nth0(1,Input,Columntemp),
    letter(Column,Columntemp),
    
    Line < 8,
    Column < 8,
    Line > 0,
    Column > 0
.

readPlayerToPosition(Line,Column) :-
    write('Out of board!\n'),
    readPlayerToPosition(Line,Column)
.

readStonePosition(Board, Line, Column):-
    write('Drop the stone in (Ex: C3): '),
    read_line(Input),
    nth0(0,Input,Linetemp),
    letter(Line,Linetemp),

    nth0(1,Input,Columntemp),
    letter(Column,Columntemp),

    at(Board,Line,Column,empty)
.

readStonePosition(Board, Line, Column):-
    write('Unable to drop stone in that position!\n'),
    readStonePosition(Board,Line,Column)
.