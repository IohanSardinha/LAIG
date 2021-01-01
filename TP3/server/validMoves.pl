% [ ][ ][ ]     [ ][ ][ ]
% [ ][X][ ] --> [ ][ ][X]
% [ ][ ][ ]     [ ][ ][ ]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine + 1,
    ToColumn is FromColumn,
    at(Board, ToLine, ToColumn, empty)
.
% [ ][ ][ ]     [ ][ ][X]
% [ ][X][ ] --> [ ][ ][ ]
% [ ][ ][ ]     [ ][ ][ ]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine + 1,
    ToColumn is FromColumn + 1,
    at(Board, ToLine, ToColumn, empty)
.
% [ ][ ][ ]     [ ][ ][ ]
% [ ][X][ ] --> [ ][ ][ ]
% [ ][ ][ ]     [ ][ ][X]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine + 1,
    ToColumn is FromColumn - 1,
    at(Board, ToLine, ToColumn, empty)
.
% [ ][ ][ ]     [ ][ ][ ]
% [ ][X][ ] --> [X][ ][ ]
% [ ][ ][ ]     [ ][ ][ ]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine - 1,
    ToColumn is FromColumn,
    at(Board, ToLine, ToColumn, empty)
.
% [ ][ ][ ]     [X][ ][ ]
% [ ][X][ ] --> [ ][ ][ ]
% [ ][ ][ ]     [ ][ ][ ]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine - 1,
    ToColumn is FromColumn + 1,
    at(Board, ToLine, ToColumn, empty)
.
% [ ][ ][ ]     [ ][ ][ ]
% [ ][X][ ] --> [ ][ ][ ]
% [ ][ ][ ]     [X][ ][ ]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine - 1,
    ToColumn is FromColumn - 1,
    at(Board, ToLine, ToColumn, empty)
.
% [ ][ ][ ]     [ ][ ][ ]
% [ ][X][ ] --> [ ][ ][ ]
% [ ][ ][ ]     [ ][X][ ]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine,
    ToColumn is FromColumn - 1,
    at(Board, ToLine, ToColumn, empty)
.
% [ ][ ][ ]     [ ][X][ ]
% [ ][X][ ] --> [ ][ ][ ]
% [ ][ ][ ]     [ ][ ][ ]
validWalk(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine,
    ToColumn is FromColumn + 1,
    at(Board, ToLine, ToColumn, empty)
.

% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [ ][S][ ][S][X]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine,
    ToColumn is FromColumn+2,
    StoneColumn is FromColumn+1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, FromLine, StoneColumn, stone)
.

% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [X][S][ ][S][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine,
    ToColumn is FromColumn-2,
    StoneColumn is FromColumn-1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, FromLine, StoneColumn, stone)
.


% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [ ][S][ ][S][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][x]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine+2,
    ToColumn is FromColumn+2,
    StoneLine is FromLine + 1,
    StoneColumn is FromColumn+1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, StoneLine, StoneColumn, stone)
.

% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [ ][S][ ][S][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [x][ ][ ][ ][ ]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine-2,
    ToColumn is FromColumn+2,
    StoneLine is FromLine - 1,
    StoneColumn is FromColumn+1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, StoneLine, StoneColumn, stone)
.

% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [ ][S][ ][S][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [X][ ][ ][ ][ ]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine+2,
    ToColumn is FromColumn-2,
    StoneLine is FromLine + 1,
    StoneColumn is FromColumn-1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, StoneLine, StoneColumn, stone)
.

% [ ][ ][ ][ ][ ]     [X][ ][ ][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [ ][S][ ][S][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine-2,
    ToColumn is FromColumn-2,
    StoneLine is FromLine - 1,
    StoneColumn is FromColumn-1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, StoneLine, StoneColumn, stone)
.

% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [ ][S][ ][S][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [ ][ ][X][ ][ ]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine+2,
    ToColumn is FromColumn,
    StoneLine is FromLine + 1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, StoneLine, FromColumn, stone)
.

% [ ][ ][ ][ ][ ]     [ ][ ][X][ ][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][S][X][S][ ] --> [ ][S][ ][S][ ]
% [ ][S][S][S][ ]     [ ][S][S][S][ ]
% [ ][ ][ ][ ][ ]     [ ][ ][ ][ ][ ]
validJump(Board, FromLine, FromColumn, ToLine, ToColumn) :-
    ToLine is FromLine-2,
    ToColumn is FromColumn,
    StoneLine is FromLine - 1,
    at(Board, ToLine, ToColumn, empty),
    at(Board, StoneLine, FromColumn, stone)
.

valid_moves(GameState, Line, Column, ListOfMoves):-
    board(GameState, Board),
    findAllPossibleMoves(Board, Line, Column, ListOfMoves)
.

valid_moves(GameState, Player, ListOfMoves):-
    board(GameState, Board),
    findall([X,Y], at(Board, X, Y, Player), [[FirstX,FirstY],[SecondX,SecondY]]),
    findAllPossibleMoves(Board, FirstX, FirstY, AllFirstPossibleMoves),
    findAllPossibleMoves(Board, SecondX, SecondY, AllSecondPossibleMoves),
    append(AllFirstPossibleMoves,AllSecondPossibleMoves, ListOfMoves)
.