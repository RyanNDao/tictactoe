const tiles = document.querySelectorAll('.game-tile');
const resetButton = document.querySelector('.reset-button');
const message = document.querySelector('.message');
resetButton.addEventListener('click', initializeGame);

const Gameboard = (boardState, playerOneTurn, playerOneObject, playerTwoObject) => {
    function playRound() {
        const currentPlayer = this.playerOneTurn ? this.playerOneObject : this.playerTwoObject;
        console.log(currentPlayer);
        for (let idx = 1; idx < tiles.length + 1; idx++) {
            const tile = tiles[idx - 1];
            tile.boundApplyMove = applyMove.bind(this, tile, currentPlayer, idx);
            if (!tile.classList.contains('space-occupied')) {
                tile.addEventListener('click', tile.boundApplyMove);
            }
        }
    }

    function applyMove(tile, currentPlayer, idx) {
        currentPlayer.spacesOwned.push(idx);
        this.boardState[idx - 1] = currentPlayer.piece;
        tile.classList.add('space-occupied');
        tile.textContent = currentPlayer.piece;
        tiles.forEach((tileSpace) => {
            tileSpace.removeEventListener('click', tileSpace.boundApplyMove);
        });
        this.playerOneTurn = this.playerOneTurn === false;
        const winner = this.checkForWin();
        if (winner) {
            message.textContent = `${winner.playerName} (${winner.piece}) has won!`;
        } else {
            this.playRound();
        }
    }

    function checkForWin() {
        const playerOneTiles = this.playerOneObject.spacesOwned;
        const playerTwoTiles = this.playerTwoObject.spacesOwned;
        const winLocations = [[1, 2, 3], [4, 5, 6], [7, 8, 9],
            [1, 4, 7], [2, 5, 8], [3, 6, 9],
            [1, 5, 9], [3, 5, 7]];
        // eslint-disable-next-line arrow-body-style
        const checker = (playerTiles, winLocation) => {
            return winLocation.every((tileLocation) => playerTiles.includes(tileLocation));
        };
        // eslint-disable-next-line no-restricted-syntax
        for (const winLocation of winLocations) {
            if (checker(playerOneTiles, winLocation)) {
                for (let idx of winLocation) {
                    tiles[idx - 1].classList.add('victory-tile');
                }
                return this.playerOneObject;
            } else if (checker(playerTwoTiles, winLocation)) {
                for (let idx of winLocation) {
                    tiles[idx - 1].classList.add('victory-tile');
                }
                return this.playerTwoObject;
            }
        }
        return false;
    }

    return {
        boardState,
        playerOneTurn,
        playerOneObject,
        playerTwoObject,
        playRound,
        applyMove,
        checkForWin,
    };
};

const PlayerOne = (piece, spacesOwned) => {
    const playerName = prompt('What is Player One\'s name?');
    return {
        playerName, piece, spacesOwned,
    };
};

const PlayerTwo = (piece, spacesOwned) => {
    const playerName = prompt('What is Player Two\'s name?');
    return {
        playerName, piece, spacesOwned,
    };
};

function initializeGame() {
    const newPlayerOne = PlayerOne('X', []);
    const newPlayerTwo = PlayerTwo('O', []);
    const boardState = ['-', '-', '-',
        '-', '-', '-',
        '-', '-', '-'];
    const currentGameboard = Gameboard(boardState, true, newPlayerOne, newPlayerTwo);
    tiles.forEach((tile) => {
        tile.classList.remove('space-occupied', 'victory-tile');
        tile.textContent = '';
    });
    message.textContent = `${newPlayerOne.playerName} (${newPlayerOne.piece}) | ${newPlayerTwo.playerName} (${newPlayerTwo.piece})`;
    currentGameboard.playRound();
}

initializeGame();
