import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Trophy } from 'lucide-react';

type Player = 'X' | 'O';
type Board = (Player | null)[];

function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (boardState: Board) => {
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        setWinningCells(pattern);
        return boardState[a];
      }
    }
    if (boardState.every(cell => cell !== null)) return 'Draw';
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner !== 'Draw') {
        setScores(prev => ({
          ...prev,
          [gameWinner]: prev[gameWinner as Player] + 1
        }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Tic Tac Toe
            </h1>
          </div>
          <button
            onClick={resetGame}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="text-xl font-semibold text-pink-500">Player X</div>
            <div className="text-2xl font-bold">{scores.X}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-violet-500">Player O</div>
            <div className="text-2xl font-bold">{scores.O}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner}
              className={`
                h-24 rounded-xl text-4xl font-bold transition-all duration-200
                ${!cell && !winner ? 'hover:bg-gray-50 hover:shadow-md' : ''}
                ${cell ? 'bg-white shadow-sm' : 'bg-gray-50'}
                ${winningCells.includes(index) ? 'bg-green-100 animate-pulse' : ''}
                ${cell === 'X' ? 'text-pink-500' : 'text-violet-500'}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {winner && (
          <div className="text-center mt-6">
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-gray-800">
                {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
              </h2>
            </div>
          </div>
        )}

        {!winner && (
          <div className="text-center mt-6">
            <p className="text-lg text-gray-600">
              Current Player: <span className={`font-bold ${currentPlayer === 'X' ? 'text-pink-500' : 'text-violet-500'}`}>{currentPlayer}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;