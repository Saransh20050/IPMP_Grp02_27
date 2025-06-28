document.addEventListener('DOMContentLoaded', () => {
    // Game state
    const gameState = {
        board: Array(8).fill().map(() => Array(8).fill(null)),
        currentPlayer: 1,
        selectedPiece: null,
        turnTime: 30,
        timerInterval: null,
        gamePaused: false,
        pieces: [
            { id: 'ricochet', name: 'Ricochet', move: ricochetMove, player: 1, symbol: 'R' },
            { id: 'jumper', name: 'Jumper', move: jumperMove, player: 1, symbol: 'J' },
            { id: 'slither', name: 'Slither', move: slitherMove, player: 1, symbol: 'S' },
            { id: 'pounder', name: 'Pounder', move: pounderMove, player: 1, symbol: 'P' },
            { id: 'teleport', name: 'Teleport', move: teleportMove, player: 1, symbol: 'T' },
            { id: 'ricochet2', name: 'Ricochet', move: ricochetMove, player: 2, symbol: 'R' },
            { id: 'jumper2', name: 'Jumper', move: jumperMove, player: 2, symbol: 'J' },
            { id: 'slither2', name: 'Slither', move: slitherMove, player: 2, symbol: 'S' },
            { id: 'pounder2', name: 'Pounder', move: pounderMove, player: 2, symbol: 'P' },
            { id: 'teleport2', name: 'Teleport', move: teleportMove, player: 2, symbol: 'T' }
        ]
    };

    // DOM elements
    const boardElement = document.getElementById('board');
    const currentPlayerDisplay = document.getElementById('current-player');
    const turnTimerDisplay = document.getElementById('turn-timer');
    const resetBtn = document.getElementById('reset-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const selectedPieceInfo = document.getElementById('selected-piece-info');

    // Initialize the game
    initGame();

    // Event listeners
    resetBtn.addEventListener('click', resetGame);
    pauseBtn.addEventListener('click', pauseGame);
    resumeBtn.addEventListener('click', resumeGame);

    // Initialize the game
    function initGame() {
        createBoard();
        placePieces();
        startTurnTimer();
        updatePlayerDisplay();
    }

    // Create the game board
    function createBoard() {
        boardElement.innerHTML = '';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => handleCellClick(row, col));
                
                boardElement.appendChild(cell);
            }
        }
    }

    // Place pieces on the board
    function placePieces() {
        // Clear the board
        gameState.board = Array(8).fill().map(() => Array(8).fill(null));
        
        // Player 1 pieces (bottom)
        gameState.board[7][0] = findPiece('ricochet');
        gameState.board[7][1] = findPiece('jumper');
        gameState.board[7][2] = findPiece('slither');
        gameState.board[7][3] = findPiece('pounder');
        gameState.board[7][4] = findPiece('teleport');
        
        // Player 2 pieces (top)
        gameState.board[0][7] = findPiece('ricochet2');
        gameState.board[0][6] = findPiece('jumper2');
        gameState.board[0][5] = findPiece('slither2');
        gameState.board[0][4] = findPiece('pounder2');
        gameState.board[0][3] = findPiece('teleport2');
        
        renderBoard();
    }


    

    // Find piece by ID
    function findPiece(id) {
        return gameState.pieces.find(p => p.id === id);
    }

    // Render the board
    function renderBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const piece = gameState.board[row][col];
            
            // Clear the cell
            cell.innerHTML = '';
            cell.classList.remove('highlight', 'target');
            
            // Add piece if present
            if (piece) {
                const pieceElement = document.createElement('div');
                pieceElement.className = `piece p${piece.player}`;
                pieceElement.textContent = piece.symbol;
                pieceElement.dataset.pieceId = piece.id;
                cell.appendChild(pieceElement);
            }
        });
    }

    // Handle cell click
    function handleCellClick(row, col) {
        if (gameState.gamePaused) return;
        
        const piece = gameState.board[row][col];
        
        // If no piece is selected and the clicked cell has a current player's piece
        if (!gameState.selectedPiece && piece && piece.player === gameState.currentPlayer) {
            gameState.selectedPiece = { row, col, piece };
            highlightValidMoves(row, col, piece);
            showPieceInfo(piece);
        } 
        // If a piece is already selected
        else if (gameState.selectedPiece) {
            const { row: fromRow, col: fromCol, piece: selectedPiece } = gameState.selectedPiece;
            
            // Check if the clicked cell is a valid move
            if (isValidMove(fromRow, fromCol, row, col, selectedPiece)) {
                // Move the piece
                gameState.board[row][col] = selectedPiece;
                gameState.board[fromRow][fromCol] = null;
                
                // Switch player
                switchPlayer();
                
                // Clear selection and highlights
                clearHighlights();
                gameState.selectedPiece = null;
                selectedPieceInfo.textContent = '';
                
                // Re-render the board
                renderBoard();
            } 
            // If clicking on another piece of the same player, select that piece instead
            else if (piece && piece.player === gameState.currentPlayer) {
                clearHighlights();
                gameState.selectedPiece = { row, col, piece };
                highlightValidMoves(row, col, piece);
                showPieceInfo(piece);
            }
            // If clicking elsewhere, clear selection
            else {
                clearHighlights();
                gameState.selectedPiece = null;
                selectedPieceInfo.textContent = '';
            }
        }
    }

    // Highlight valid moves for a piece
    function highlightValidMoves(row, col, piece) {
        const cells = document.querySelectorAll('.cell');
        
        cells.forEach(cell => {
            const targetRow = parseInt(cell.dataset.row);
            const targetCol = parseInt(cell.dataset.col);
            
            if (isValidMove(row, col, targetRow, targetCol, piece)) {
                cell.classList.add('highlight');
                
                // If the target is an opponent's piece, mark it as a target
                const targetPiece = gameState.board[targetRow][targetCol];
                if (targetPiece && targetPiece.player !== gameState.currentPlayer) {
                    cell.classList.add('target');
                }
            }
        });
    }

    // Clear all highlights
    function clearHighlights() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('highlight', 'target');
        });
    }

    // Check if a move is valid
    function isValidMove(fromRow, fromCol, toRow, toCol, piece) {
        // Can't move to the same position
        if (fromRow === toRow && fromCol === toCol) return false;
        
        // Can't capture your own piece
        const targetPiece = gameState.board[toRow][toCol];
        if (targetPiece && targetPiece.player === gameState.currentPlayer) return false;
        
        // Check piece-specific movement
        return piece.move(fromRow, fromCol, toRow, toCol, gameState.board, gameState.currentPlayer);
    }

    // Switch to the next player
    function switchPlayer() {
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        gameState.turnTime = 30;
        updatePlayerDisplay();
        clearInterval(gameState.timerInterval);
        startTurnTimer();
    }

    // Update player display
    function updatePlayerDisplay() {
        currentPlayerDisplay.textContent = `Player ${gameState.currentPlayer}'s Turn`;
        currentPlayerDisplay.style.color = gameState.currentPlayer === 1 ? '#e74c3c' : '#3498db';
    }

    // Start the turn timer
    function startTurnTimer() {
        updateTimerDisplay();
        gameState.timerInterval = setInterval(() => {
            if (!gameState.gamePaused) {
                gameState.turnTime--;
                updateTimerDisplay();
                
                if (gameState.turnTime <= 0) {
                    clearInterval(gameState.timerInterval);
                    switchPlayer();
                }
            }
        }, 1000);
    }

    // Update timer display
    function updateTimerDisplay() {
        turnTimerDisplay.textContent = `Time: ${gameState.turnTime}s`;
        
        // Change color when time is running low
        if (gameState.turnTime <= 10) {
            turnTimerDisplay.style.color = '#e74c3c';
        } else {
            turnTimerDisplay.style.color = '#666';
        }
    }

    // Show piece information
    function showPieceInfo(piece) {
        selectedPieceInfo.innerHTML = `
            <strong>${piece.name}</strong> (Player ${piece.player})<br>
            <em>Movement:</em> ${getPieceDescription(piece)}
        `;
    }

    // Get piece description
    function getPieceDescription(piece) {
        switch(piece.name) {
            case 'Ricochet': return 'Moves in straight lines, bounces off walls';
            case 'Jumper': return 'Moves in L-shapes (like knight in chess)';
            case 'Slither': return 'Moves diagonally, can slide multiple squares';
            case 'Pounder': return 'Moves orthogonally, can crush adjacent pieces';
            case 'Teleport': return 'Can teleport to any empty square';
            default: return '';
        }
    }

    // Reset the game
    function resetGame() {
        clearInterval(gameState.timerInterval);
        gameState.currentPlayer = 1;
        gameState.selectedPiece = null;
        gameState.turnTime = 30;
        gameState.gamePaused = false;
        
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
        
        initGame();
        selectedPieceInfo.textContent = '';
    }

    // Pause the game
    function pauseGame() {
        gameState.gamePaused = true;
        pauseBtn.disabled = true;
        resumeBtn.disabled = false;
        clearHighlights();
        gameState.selectedPiece = null;
    }

    // Resume the game
    function resumeGame() {
        gameState.gamePaused = false;
        pauseBtn.disabled = false;
        resumeBtn.disabled = true;
    }

    // Piece movement logic functions
    function ricochetMove(fromRow, fromCol, toRow, toCol, board, currentPlayer) {
        // Ricochet moves in straight lines and can bounce off walls
        // For simplicity, we'll implement straight line movement without bouncing
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        // Must move in a straight line
        if (rowDiff !== 0 && colDiff !== 0 && rowDiff !== colDiff) return false;
        
        // Check path is clear
        const rowStep = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
        const colStep = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol] !== null) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        // Can capture opponent's piece at destination
        const targetPiece = board[toRow][toCol];
        return targetPiece === null || targetPiece.player !== currentPlayer;
    }

    function jumperMove(fromRow, fromCol, toRow, toCol, board, currentPlayer) {
        // Jumper moves in L-shapes (like knight in chess)
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        // Valid L-shape moves
        if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
            return false;
        }
        
        // Can jump over pieces
        const targetPiece = board[toRow][toCol];
        return targetPiece === null || targetPiece.player !== currentPlayer;
    }

    function slitherMove(fromRow, fromCol, toRow, toCol, board, currentPlayer) {
        // Slither moves diagonally any number of squares
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        // Must move diagonally
        if (rowDiff !== colDiff || rowDiff === 0) return false;
        
        // Check path is clear
        const rowStep = toRow > fromRow ? 1 : -1;
        const colStep = toCol > fromCol ? 1 : -1;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol] !== null) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        // Can capture opponent's piece at destination
        const targetPiece = board[toRow][toCol];
        return targetPiece === null || targetPiece.player !== currentPlayer;
    }

    function pounderMove(fromRow, fromCol, toRow, toCol, board, currentPlayer) {
        // Pounder moves orthogonally (like rook in chess) and can crush adjacent pieces
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        // Must move orthogonally
        if (rowDiff !== 0 && colDiff !== 0) return false;
        
        // Check path is clear
        const rowStep = toRow > fromRow ? 1 : (toRow < fromRow ? -1 : 0);
        const colStep = toCol > fromCol ? 1 : (toCol < fromCol ? -1 : 0);
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (board[currentRow][currentCol] !== null) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        // Can capture opponent's piece at destination
        const targetPiece = board[toRow][toCol];
        return targetPiece === null || targetPiece.player !== currentPlayer;
    }

    function teleportMove(fromRow, fromCol, toRow, toCol, board, currentPlayer) {
        // Teleport can move to any empty square
        // Must be an empty square
        if (board[toRow][toCol] !== null) return false;
        
        // Can't stay in the same position
        return !(fromRow === toRow && fromCol === toCol);
    }
});