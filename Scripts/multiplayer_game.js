var board = null
var game = new Chess()
var $status, $fen, $pgn
var playerSide = null

function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }

    var side = playerSide !== null ? playerSide[0] : 'w'
    if (game.turn() !== side) {
        return false
    }
}

function onDrop(source, target, piece) {
    // see if the move is legal
    var move;

    if (source != 'spare') {
        move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })
    } else {
        var targetSquare = game.get(target)
        if (targetSquare == null) {
            var color = piece[0].toLowerCase()
            var pieceType = piece[1].toLowerCase()
            move = game.move({
                from: source,
                to: target,
                piece: pieceType,
                color: color
            })
        }
    }
    // illegal move
    if (move === null) {
        return 'snapback'
    }

    updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
    board.position(game.fen())
}

function updateStatus() {
    var status = ''

    var moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
    updateGameInfo()
    updateSparePieces()
    $pgn = game.pgn()
    sendGameToServer()
}

function sendGameToServer() {
    $("#updater").submit();
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: "../../Content/img/chesspieces/wikipedia/{piece}.png",
    showNotation: true,
    sparePieces: true,
    orientation: 'black'
}

function updateSparePieces() {
    var counters = $('.spare-piece-counter')
    var pieces = game.spares()

    for (var i = 0; i < counters.length; i++) {
        var currCounter = counters[i]
        var currentPiece = currCounter.getAttribute('piece')
        var currPieceColor = currentPiece[0].toLowerCase()
        var currPieceType = currentPiece[1].toLowerCase()
        currCounter.innerHTML = pieces[currPieceColor][currPieceType] + ''
    }
}

function getSparePieces() {
    var pieces = game.spares()
    var pieceSpareContainers = $('.spare-pieces-7492f')

    for (var i = 0; i < pieceSpareContainers.length; i++) {
        var container = pieceSpareContainers[i]
        var containerChildren = container.childNodes
        for (var j = 0; j < containerChildren.length; j++) {
            var currentPiece = containerChildren[j]
            var currPieceColor = currentPiece.dataset.piece[0]
            var currPieceType = currentPiece.dataset.piece[1].toLowerCase()

            if (currPieceType == 'k') {
                currentPiece.style.display = "none"
            } else {
                var count = pieces[currPieceColor][currPieceType]
                var countDiv = document.createElement('div')
                countDiv.innerHTML = count + ''

                countDiv.classList.add('spare-piece-counter')
                countDiv.setAttribute('piece', currentPiece.dataset.piece)

                $(countDiv).insertAfter(currentPiece)
                $(countDiv).css('display', 'inline-block')
                $(countDiv).css('background-color', 'white')
                $(countDiv).css('width', '4%')
                $(countDiv).css('height', $(countDiv).width())

                $(countDiv).css('border-radius', '50%')
                $(countDiv).css('border', '2px solid black')
                $(countDiv).css('color', 'black')
                $(countDiv).css('text-align', 'center')
                $(countDiv).css('font-weight', 'bold')

                $(countDiv).css('padding-top', '3px')

                $(countDiv).css('position', 'absolute')
                var position = $(currentPiece).position()
                $(countDiv).css('top', position.top + $(currentPiece).height() - $(currentPiece).height() / 3 + 'px')
                $(countDiv).css('left', position.left + $(currentPiece).width() - $(currentPiece).width() / 3 + 'px')

                j++
            }
        }
    }
}

function updateGameInfo() {
    var pgn = game.pgn()
    var pgn_moves = pgn.split(/[0-9]\./).join('').split(' ')
    $('#pgn-container')[0].innerHTML = ''

    var moveNr = 1;
    for (var i = 0; i < pgn_moves.length; i++) {
        var currMove = pgn_moves[i];
        var displayMove = ''
        if (currMove === '') {
            displayMove = moveNr + '. '
            moveNr++

            i++
            if (pgn_moves.length > i) {
                displayMove += pgn_moves[i]
            }
        } else {
            displayMove = pgn_moves[i]
        }
        var newDiv = document.createElement('div')
        newDiv.innerHTML = displayMove
        $(newDiv).css('padding-top', '10%')
        $('#pgn-container').append(newDiv)
    }
}

function customResizeFunc() {
    board.resize()
    getSparePieces()
}

window.onload = function () {
    init();
    $(window).resize(customResizeFunc)
};
function init() {
    $.noConflict(true);
    playerSide = 'white'
    config.orientation = playerSide
    board = Chessboard('board1', config)
    $status = $('#status')
    $fen = $('#fen')
    $pgn = $('#pgn')
    getSparePieces()
    updateStatus()
}
