# Mastermind

A website recreating the game mastermind.

## How to play

A random code is generated, which the player must try to guess.

At the start of the game, 6 random colors are chosen. These are the choices the player must choose from when guessing the code.  
4 random colors are then chosen from the 6 choices (repeats allowed). This is the random code which the player must try to guess.

After each guess, the player is told:

1. how many colors in their guess were correct, but in the wrong position (white pegs)
2. how many colors in their guess were both correct and in the correct position (black pegs)

The game ends when the player receives 4 black pegs (the guess matched the code exactly), or after 12 incorrect guesses.

At any point the player may see their previous guesses and pegs.

## Options

Before the game starts, the player may configure the number of colors to choose from (default 6), the length of the code (default 4) and the maximum guesses before game over (default 12);

Changing these numbers can alter the difficulty of the game.
