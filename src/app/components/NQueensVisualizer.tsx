import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function NQueensVisualizer() {
  const [n, setN] = useState(4);
  const [board, setBoard] = useState<number[][]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState([30]);
  const [currentRow, setCurrentRow] = useState(-1);
  const [currentCol, setCurrentCol] = useState(-1);
  const [solutionCount, setSolutionCount] = useState(0);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const isSafe = (board: number[][], row: number, col: number): boolean => {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }

    // Check upper left diagonal
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }

    // Check upper right diagonal
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 1) return false;
    }

    return true;
  };

  const solveNQueens = async (board: number[][], row: number): Promise<boolean> => {
    if (row === n) {
      setSolutionCount((prev) => prev + 1);
      return true;
    }

    for (let col = 0; col < n; col++) {
      setCurrentRow(row);
      setCurrentCol(col);
      await sleep(2000 - speed[0] * 18);

      if (isSafe(board, row, col)) {
        board[row][col] = 1;
        setBoard(board.map((r) => [...r]));
        await sleep(2000 - speed[0] * 18);

        if (await solveNQueens(board, row + 1)) {
          return true;
        }

        // Backtrack
        board[row][col] = 0;
        setBoard(board.map((r) => [...r]));
        await sleep(2000 - speed[0] * 18);
      }
    }

    return false;
  };

  const solve = async () => {
    setRunning(true);
    setSolutionCount(0);
    const newBoard = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0));
    setBoard(newBoard);
    await sleep(500);
    await solveNQueens(newBoard, 0);
    setCurrentRow(-1);
    setCurrentCol(-1);
    setRunning(false);
  };

  const reset = () => {
    setBoard([]);
    setCurrentRow(-1);
    setCurrentCol(-1);
    setSolutionCount(0);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 min-h-80 flex items-center justify-center">
        {board.length > 0 ? (
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {board.map((row, i) =>
              row.map((cell, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  animate={{
                    scale: currentRow === i && currentCol === j ? 1.1 : 1,
                    backgroundColor:
                      currentRow === i && currentCol === j
                        ? '#F59E0B'
                        : (i + j) % 2 === 0
                        ? '#E5E7EB'
                        : '#9CA3AF',
                  }}
                  className="w-12 h-12 flex items-center justify-center text-2xl"
                >
                  {cell === 1 && '♛'}
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="text-gray-400">Click "Solve" to start</div>
        )}
      </div>

      {solutionCount > 0 && (
        <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
          ✓ Solution found! Queens placed: {solutionCount}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Board Size:</span>
        <Select value={n.toString()} onValueChange={(v) => setN(parseInt(v))} disabled={running}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4x4</SelectItem>
            <SelectItem value="5">5x5</SelectItem>
            <SelectItem value="6">6x6</SelectItem>
            <SelectItem value="8">8x8</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Speed:</span>
        <Slider value={speed} onValueChange={setSpeed} min={1} max={100} step={1} className="flex-1" disabled={running} />
        <span className="text-sm text-gray-600 w-12">{speed[0]}%</span>
      </div>

      <div className="flex gap-2">
        <Button onClick={solve} disabled={running} className="gap-2">
          <Play className="w-4 h-4" />
          {running ? 'Solving...' : 'Solve'}
        </Button>
        <Button onClick={reset} disabled={running} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>N-Queens Problem:</strong> Place N queens on an N×N chessboard so that no two queens attack each other.
        Uses backtracking to find solution. Time: O(N!)
      </div>
    </div>
  );
}
