class ChessBoard {
    constructor(fen, reverse) {
        var self = this;
        let boardWrapper = document.getElementById("squareBoard-wrapper");
        this.board = document.createElement("div");
        this.board.id = "squareBoard";
        this.rows = [];
        this.squares = [];
        var startingFen = fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';



        let rowLetters = ['1', '2', '3', '4', '5', '6', '7', '8'];
        if (!reverse) {
            rowLetters.reverse().forEach(letter => {
                this.rows.push(this.generateRow(letter, reverse));
            });
        } else {
            rowLetters.forEach(letter => {
                this.rows.push(this.generateRow(letter, reverse));
            });
        }

        this.rows.forEach(row => {
            this.board.appendChild(row);
        });

        this.rows.forEach(row => {
            var squares = row.getElementsByClassName("chessBoard-square");
            for (let square of squares) {
                self.squares.push(square);
            }
        });


        this.configurePosition(startingFen, reverse);
        boardWrapper.appendChild(this.board);
    }

    generateRow(rowIdx, reverse) {
        let row = document.createElement("div");
        row.classList.add("squareBoard-row");
        row.id = "squareBoard-row-" + rowIdx;
        let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        if (!reverse) {
            for (let i of letters) {
                let square = document.createElement("div");
                square.classList.add('chessBoard-square');
                square.id = "squareBoard-square-" + i + rowIdx;
                square.value = i + rowIdx;
                row.appendChild(square);
                this.makeDroppable(square);
            }
        } else {
            for (let i of letters.reverse()) {
                let square = document.createElement("div");
                square.classList.add('chessBoard-square');
                square.id = "squareBoard-square-" + i + rowIdx;
                square.value = i + rowIdx;
                row.appendChild(square);
                this.makeDroppable(square);
            }
        }
        return row;
    }

    put(piece, square) {
        var pieces = {
            b: 'chessPiece-b',
            B: 'chessPiece-B',
            k: 'chessPiece-k',
            K: 'chessPiece-K',
            n: 'chessPiece-n',
            N: 'chessPiece-N',
            p: 'chessPiece-p',
            P: 'chessPiece-P',
            q: 'chessPiece-q',
            Q: 'chessPiece-Q',
            r: 'chessPiece-r',
            R: 'chessPiece-R',
        }
        var chessPieceClass = 'chessPiece';
        var newPiece = document.createElement("div");
        newPiece.classList.add(pieces[piece]);
        newPiece.classList.add(chessPieceClass);
        newPiece.value = piece;
        var pieceContainer = this.squares.find(elem => elem.value == square);
        if (pieceContainer.childNodes.length == 0) {
            pieceContainer.appendChild(newPiece);
        } else {
            pieceContainer.textContent = '';
            pieceContainer.appendChild(newPiece);
        }

        this.makeDraggable(newPiece);
        return pieceContainer;
    }

    normalizeRowFen(fen) {
        var newConfig = '';
        var i = 0;
        var acceptedCharacters = 'bBkKnNpPqQrR';
        var digits = '12345678';
        while (fen[i] != null) {
            if (digits.indexOf(fen[i]) != -1) {
                var nr = Number(fen[i]);
                while (nr != 0) {
                    newConfig += 'x';
                    nr--;
                }
            } else if (acceptedCharacters.indexOf(fen[i]) != -1) {
                newConfig += fen[i];
            } else {
                throw ('Bad config: ' + fen);
            }
            i++;
        }
        return newConfig;
    }

    putRow(rowFen, row) {
        var self = this;
        var rowConfig = self.normalizeRowFen(rowFen);
        var squareArr = row.childNodes;
        for (let i = 0; i < squareArr.length; i++) {
            if (rowConfig[i] != 'x') {
                self.put(rowConfig[i], squareArr[i].value);
            }
        }
        //row.forEach((square, index) => {
        //    if (rowConfig[index] != 'x') {
        //        self.put(rowConfig[index], square);
        //    }
        //});
    }

    clear(square) {
        var pieceContainer = this.squares.find(elem => elem.value == square);
        pieceContainer.textContent = '';
        return pieceContainer;
    }

    clearBoard() {
        for (let i = 0; i < this.squares.length; i++) {
            this.clear(this.squares[i].value);
        }
    }

    getPiece(source) {
        for (let square of this.squares) {
            if (square.value == source) {
                if (square.childNodes.length != 0) {
                    return square.childNodes[0].value;
                }
            }
        }
        return '';
    }

    move(source, dest) {
        var piece = this.getPiece(source);
        console.log('moving ' + piece + ' from ' + source + ' to ' + dest);
        if (piece) {
            this.put(piece, dest);
            this.clear(source);
        }
    }

    configurePosition(fen, reverse) {
        var self = this;
        try {

            self.clearBoard();
            var rowFenArr = fen.split('/');
            if (reverse) {
                rowFenArr.forEach((rowFen, i) => {
                    self.putRow(rowFen, self.rows[i]);
                });
            } else {
                rowFenArr.reverse().forEach((rowFen, i) => {
                    self.putRow(rowFen, self.rows[i]);
                });
            }
        } catch (e) {
            console.error("bad config");
        }
    }

    makeDroppable(square) {
        var self = this;
        $(square).droppable({
            accept: ".chessPiece",
            drop: function (event, ui) {
                var $this = $(this);
                ui.draggable.position({
                    my: "center",
                    at: "center",
                    of: $this,
                });
            },
            disabled: true
        });
    }

    makeDraggable(piece) {
        var self = this;
        var initalPosition = $(piece).position();
        $(piece).draggable({
            revert: 'invalid',
            revertDuration: 0
        });
    }
}


window.onload = function () {
    init();
};
function init() {
    $.noConflict(true);
    var chess = new Chess();
    var board = Chessboard('board1', {
        pieceTheme: "Content/img/chesspieces/wikipedia/{piece}.png",
        position: "start",
        draggable: true,
    });

}