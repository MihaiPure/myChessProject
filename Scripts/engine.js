class Engine {
    // black pieces recieve the negated value (eg: bQ is valued at -9 and wQ is valued at 9)
    evals = {
        // evaluation for each piece: king, queen, rook, bishop, knight, pawn
        k: 900,
        q: 9,
        r: 5,
        b: 3,
        n: 3,
        p: 1,
        // doubled pawns
        d: 0.5,
        // blocked pawns
        s: 0.5,
        // isolated pawns
        i: 0.5,
        // mobility - number of moves available
        m: 0.1
    }

    positional_evals = {
        k: [
            [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
            [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
            [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
            [-0.3, -0.4, -0.4, -0.5, -0.5, -0.4, -0.4, -0.3],
            [-0.2, -0.3, -0.3, -0.4, -0.4, -0.3, -0.3, -0.2],
            [-0.1, -0.2, -0.2, -0.2, -0.2, -0.2, -0.2, -0.1],
            [0.3, 0.2, 0.0, 0.0, 0.0, 0.0, 0.2, 0.3],
            [0.3, 0.5, 0.1, 0.0, 0.0, 0.2, 0.5, 0.3]
        ],
        q: [
            [-0.2, -0.1, -0.1, -0.05, -0.05, -0.1, -0.1, -0.2],
            [-0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.1],
            [-0.1, 0.0, 0.05, 0.05, 0.05, 0.05, 0.0, -0.1],
            [-0.05, 0.0, 0.05, 0.05, 0.05, 0.05, 0.0, -0.05],
            [0.0, 0.0, 0.05, 0.05, 0.05, 0.05, 0.0, -0.05],
            [-0.1, 0.05, 0.05, 0.05, 0.05, 0.05, 0.0, -0.1],
            [-0.1, 0.0, 0.05, 0.0, 0.0, 0.0, 0.0, -0.1],
            [-0.2, -0.1, -0.1, -0.05, -0.05, -0.1, -0.1, -0.2]
        ],
        r: [
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.05, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.05],
            [-0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.05],
            [-0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.05],
            [-0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.05],
            [-0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.05],
            [-0.05, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.05],
            [0.0, 0.0, 0.01, 0.05, 0.05, 0.0, 0.0, 0.0]
        ],
        b: [
            [-0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.2],
            [-0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.1],
            [-0.1, 0.0, 0.05, 0.1, 0.1, 0.05, 0.0, -0.1],
            [-0.1, 0.1, 0.05, 0.1, 0.1, 0.05, 0.1, -0.1],
            [-0.1, 0.0, 0.15, 0.1, 0.1, 0.15, 0.0, -0.1],
            [-0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1],
            [-0.1, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1, -0.1],
            [-0.2, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.2]
        ],
        n: [
            [-0.5, -0.4, -0.3, -0.3, -0.3, -0.3, -0.4, -0.5],
            [-0.4, -0.2, 0, 0, 0, 0, -0.2, -0.4],
            [-0.3, 0, 0.1, 0.15, 0.15, 0.1, 0, -0.3],
            [-0.3, 0.05, 0.15, 0.2, 0.2, 0.15, 0.05, -0.3],
            [-0.3, 0, 0.15, 0.2, 0.2, 0.15, 0, -0.3],
            [-0.3, 0.05, 0.1, 0.15, 0.15, 0.1, 0.05, -0.3],
            [-0.4, -0.2, 0, 0.05, 0.05, 0, -0.2, -0.4],
            [-0.5, -0.4, -0.3, -0.3, -0.3, -0.3, -0.4, -0.5]
        ],
        p: [
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
            [0.1, 0.1, 0.2, 0.35, 0.35, 0.2, 0.1, 0.1],
            [0.05, 0.05, 0.1, 0.3, 0.3, 0.1, 0.05, 0.05],
            [0.0, 0.0, 0.0, 0.25, 0.25, 0.0, 0.0, 0.0],
            [0.05, -0.05, -0.1, 0.0, 0.0, -0.1, -0.05, 0.05],
            [0.05, 0.1, 0.1, -0.3, -0.3, 0.1, 0.1, 0.05],
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        ]
    }

    //efficiency counter
    counter = 0

    counter() {
        return counter;
    }

    constructor() {
        var self = this

    }

    sort_moves(moves) {
        moves.sort((move1, move2) => {
            if (move1.flags.indexOf('p') != -1) {
                return -1
            }
            if (move2.flags.indexOf('p') != -1) {
                return 1
            }
            if (move1.flags.indexOf('k') != -1) {
                return -1
            }
            if (move2.flags.indexOf('k') != -1) {
                return 1
            }
            if (move1.flags.indexOf('q') != -1) {
                return -1
            }
            if (move2.flags.indexOf('q') != -1) {
                return 1
            }
            if (move1.flags.indexOf('c') != -1) {
                return -1
            }
            if (move2.flags.indexOf('c') != -1) {
                return 1
            }
            if (move1.flags.indexOf('e') != -1) {
                return -1
            }
            if (move2.flags.indexOf('e') != -1) {
                return 1
            }
            if (move1.flags.indexOf('s') != -1) {
                return -1
            }
            if (move2.flags.indexOf('s') != -1) {
                return 1
            }
            return 0
        })
        return moves
    }

    eval_square(board, i, j) {
        var self = this

        function eval_func(board, i, j, color) {
            var piece = board[i][j]

            var val = self.evals[piece.type];
            if (color === 'w') {
                val += self.positional_evals[piece.type][i][j];
            } else {
                val += self.positional_evals[piece.type][7 - i][j];
            }

            return color === 'w' ? val : -val;
        }

        // empty squares don't add any value to the evaluation function
        if (board[i][j] === null) {
            return 0
        }

        var piece = board[i][j]
        if (typeof (piece) === 'object') {

            return eval_func(board, i, j, piece.color)
        } else {
            console.warn('board should only contain objects or null; ignore if you know what you\'re doing')
            return 0
        }
    }

    eval_spare_pieces(spare_pieces) {
        var local_total = 0
        for (let field in spare_pieces['w']) {
            local_total += spare_pieces['w'][field]
        }
        for (let field in spare_pieces['b']) {
            local_total -= spare_pieces['b'][field]
        }
        return local_total
    }

    eval_position(board, spare_pieces) {
        var self = this
        var total = 0
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                total += self.eval_square(board, i, j)
            }
        }
        total += self.eval_spare_pieces(spare_pieces)
        // later: take into consideration the number of moves on each side and compare
        self.counter++
        return total
    }

    alphaBeta(depth, game, side) {
        var self = this
        self.counter = 0
        var moves = game.moves({
            verbose: true
        })
        moves = this.sort_moves(moves);
        var bestMove = {
            moveObj: null,
            evaluation: -99999
        }

        moves.forEach(move => {
            game.move(move)
            var evaluation
            if (side === 'b') {
                evaluation = self.alphaBetaMin(-99999, 99999, depth, game)
            } else {
                evaluation = self.alphaBetaMax(-99999, 99999, depth, game)
            }
            game.undo()
            if (evaluation > bestMove.evaluation) {
                bestMove.moveObj = move
                bestMove.evaluation = evaluation
            }
        });
        console.log(self.counter);
        return bestMove.moveObj
    }

    alphaBetaMax(alpha, beta, depth, game) {
        var self = this

        if (depth === 0) {
            return self.eval_position(game.board(), game.spares())
        }
        var moves = game.moves({
            verbose: true
        })
        moves = this.sort_moves(moves);
        for (var i = 0; i < moves.length; i++) {
            game.move(moves[i])
            var score = self.alphaBetaMin(alpha, beta, depth - 1, game)
            game.undo()
            if (score >= beta) {
                return beta //beta cut-off
            }
            if (score > alpha) {
                alpha = score
            }
        }
        return alpha
    }

    alphaBetaMin(alpha, beta, depth, game) {
        var self = this

        if (depth === 0) {
            return -self.eval_position(game.board(), game.spares())
        }
        var moves = game.moves({
            verbose: true
        })
        moves = this.sort_moves(moves);
        for (var i = 0; i < moves.length; i++) {
            game.move(moves[i])
            var score = self.alphaBetaMax(alpha, beta, depth - 1, game)
            game.undo()
            if (score <= alpha) {
                return alpha // alpha cut-off
            }
            if (score < beta) {
                beta = score
            }
        }
        return beta
    }
}
