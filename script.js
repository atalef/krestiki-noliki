const victories = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

let game = [null, null, null, null, null, null, null, null, null]

function Player(name, sign, color) {
    this.name = name
    this.sign = sign
    this.color = color
}

let firstPlayer = new Player("Haya", "X", "rgb(83, 83, 86)"),
    secondPlayer = new Player("Israel", "O", "rgb(238, 72, 11)")

let currentPlayer = firstPlayer
let currentPos = null
let moves = []

newGame()

function newGame() {
    clearBoard()
    setBoard()
    currentPlayer = firstPlayer
    setPlayers(firstPlayer, secondPlayer)
    setTurn(currentPlayer)
}

function setBoard() {
    document.getElementById('flex-box').innerHTML =
        game.map((item, i, arr) =>
            `<div 
                class="cell" 
                onclick="makeMove(this)" 
                id="id${i}"
            ></div>`
        ).join('')
}

function clearBoard() {
    game = game.map(cell => cell = null)
    moves = []
}

function setPlayers(p1, p2) {
    document.getElementById('p1').innerText = `Player 1 - ${p1.name} - ${p1.sign}`
    document.getElementById('p2').innerText = `Player 2 - ${p2.name} - ${p2.sign}`
}

function setTurn(currentPlayer) {
    document.getElementById('turn').innerText =
        `Your turn, ${currentPlayer.name}!`
}


function makeMove(event) {
    let pos = Number(event.id.split('id')[1])
    if (game[pos]) {
        return false
    }

    else {
        game[pos] = currentPlayer.sign
        moves.push([currentPlayer.sign, pos])
        fillCell(currentPlayer, pos)
        currentPos = pos
        if (moves.length > 4) {
            let win = checkVictory(pos, currentPlayer.sign)
            if (win) {
                setTimeout(function(){ alert(currentPlayer.name + ' win') }, 300);
                return;
            }
        }
        changePlayer()
    }
}

function changePlayer() {
    currentPlayer = currentPlayer == firstPlayer ? secondPlayer : firstPlayer
    setTurn(currentPlayer)
}

function getPlayerBySign(sign) {
    let player
    if (sign == 'X') { player = firstPlayer }
    else { player = secondPlayer } 
    return player
}

function fillCell(player, pos) {
    let elem = document.getElementById(`id${pos}`)
    elem.innerText = player.sign
    elem.style.backgroundColor = player.color
}

function clearLastCell() {
    if (currentPos != null) {
        let elem = document.getElementById(`id${currentPos}`)
        elem.innerText = ''
        elem.style.backgroundColor = "gainsboro"
    }
}

function checkVictory(pos, sign) {
    let options = victories.filter(item => item.includes(pos))
    for (i of options) {
        if (game[i[0]] == sign &&
            game[i[1]] == sign &&
            game[i[2]] == sign) {
            return true;
        }
    }

}

function saveGame() {
    const gameToSave = JSON.stringify(moves)
    localStorage.setItem("game", gameToSave)
}

function loadGame() {
    let gameToLoad = localStorage.getItem("game");
    let loadMoves = JSON.parse(gameToLoad);
    restoreGame(loadMoves)
}

function restoreGame(load) {
    clearBoard()
    setBoard()
    moves = load
    currentPlayer = getPlayerBySign(load[load.length-2][0])
    setTurn(currentPlayer)
    currentPos = load[load.length-1][1]
    moves.forEach(el => { 
        let p = getPlayerBySign(el[0])
        game[el[1]] = el[0]
        pos = el[1]
        fillCell(p, pos)
    });
}

function cancelMove() {
    if (moves.length > 0) {
        clearLastCell()
        game[currentPos] = null
        moves.pop()
        let last = moves[moves.length - 1]
        // console.log('last: ' + last + 'last2: ' + last2)
        currentPos = last ? last[1] : null

        changePlayer()
    }
}