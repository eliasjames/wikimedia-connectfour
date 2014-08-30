wikimedia-connectfour
=====================

Thoughts...

Connect Four exercise

The primary action in the app is the turn. On each turn, the player chooses a column to drop into, and the row position is determined by previous plays. After each turn, check for winning connections. 

The win check is the most complicated logic. On each drop, the dropped piece can be surrounded by up to seven other pieces. Also, the dropped piece may be in the middle or at the end of a connection, so checks need to extend in both directions.

Requirement: will need to store piece positions in memory for modularity.

Possible approaches:
- On each drop, scan the entire board for winning connections.
- On each drop, check each surrounding piece for a match, and if so, recursively check the pieces in the direction of the potential connection. If there isn’t a full connection, also check in the opposite direction.
- Store separate data on all existing connections: position, direction, length. On each drop, check the connections list, and update or create new. Or similar, store the data on each adjacent connection for each cell, minesweeper style. 

Lookup approach is the best choice. Full scan is basically the same logic but overkill. Stored data approach is more complicated and doesn’t have any necessary performance or feature benefits. 

Recommendation: use an array of arrays to store piece data.
