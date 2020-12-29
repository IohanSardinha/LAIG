replaceInList([_H|T], 1, Value, [Value|T]).
replaceInList([H|T], Index, Value, [H|TNew]) :-
        Index > 1,
        Index1 is Index - 1,
        replaceInList(T, Index1, Value, TNew).

replaceInMatrix([H|T], 1, Column,Value, [HNew|T]) :-
        replaceInList(H, Column, Value, HNew).

replaceInMatrix([H|T], Row, Column, Value, [H|TNew]) :-
        Row > 1,
        Row1 is Row - 1,
        replaceInMatrix(T, Row1, Column, Value, TNew).

%letter(+Number, -Letter).
%Letter to be printed for each board row
letter(1, 'A').
letter(2, 'B').
letter(3, 'C').
letter(4, 'D').
letter(5, 'E').
letter(6, 'F').
letter(7, 'G').

letter(1, a).
letter(2, b).
letter(3, c).
letter(4, d).
letter(5, e).
letter(6, f).
letter(7, g).

letter(1, 49).
letter(2, 50).
letter(3, 51).
letter(4, 52).
letter(5, 53).
letter(6, 54).
letter(7, 55).

letter(1, 97).
letter(2, 98).
letter(3, 99).
letter(4, 100).
letter(5, 101).
letter(6, 102).
letter(7, 103).

letter(1, 65).
letter(2, 66).
letter(3, 67).
letter(4, 68).
letter(5, 69).
letter(6, 70).
letter(7, 71).

letter(82,r).
letter(89,y).

letter(r,'R').
letter(stone,'O').
letter(empty,' ').
letter(y,'Y').

%nextPlayer(+CurrentPlayer, NextPlayer)
nextPlayer(r,y).
nextPlayer(y,r).

%Clears the screen
cls :- cls(100).
cls(N) :- N > 0, write('\n'), N1 is N -1, cls(N1).
cls(_).

%at(+Mat, +-Row, +-Col, -+Val)
at(Mat, Row, Col, Val) :- nth1(Row, Mat, ARow), nth1(Col, ARow, Val).

distance2D(X1, Y1, X2, Y2, Distance):- Distance is sqrt((X1 - X2)**2 + (Y1 - Y2)**2).

listSum([],[],[]).
listSum([A],[B],[C]):- C is A+B.
listSum([A|TA],[B|TB],[C|TC]) :- C is A+B, listSum(TA,TB,TC).

listSub([],[],[]).
listSub([A],[B],[C]):- C is A-B.
listSub([A|TA],[B|TB],[C|TC]) :- C is A-B, listSub(TA,TB,TC).

distanceSum( _ , _ , [], 0, _).
distanceSum(FromX, FromY, [[ToX,ToY]], Sum, Counter):-
    distance2D(FromX, FromY, ToX, ToY, Distance),
    Sum is Counter + Distance
.
distanceSum(FromX, FromY, [[ToX,ToY]|Tail], Sum, Temp):-
    distance2D(FromX, FromY, ToX, ToY, Distance),
    Counter is Temp + Distance,
    distanceSum(FromX, FromY, Tail, Sum, Counter)
.

distanceSum(FromX, FromY, Positions, Sum):-distanceSum(FromX, FromY, Positions, Sum, 0).