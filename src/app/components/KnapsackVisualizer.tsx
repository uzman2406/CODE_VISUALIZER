import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';

interface Item {
  name: string;
  weight: number;
  value: number;
}

export function KnapsackVisualizer() {
  const items: Item[] = [
    { name: 'Item 1', weight: 2, value: 3 },
    { name: 'Item 2', weight: 3, value: 4 },
    { name: 'Item 3', weight: 4, value: 5 },
    { name: 'Item 4', weight: 5, value: 8 },
  ];

  const capacity = 8;

  const [dpTable, setDpTable] = useState<number[][]>([]);
  const [selectedItems, setSelectedItems] = useState<boolean[]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState([30]);
  const [currentCell, setCurrentCell] = useState<{ i: number; w: number } | null>(null);
  const [maxValue, setMaxValue] = useState(0);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const solveKnapsack = async () => {
    setRunning(true);
    setSelectedItems([]);
    setMaxValue(0);

    const n = items.length;
    const dp: number[][] = Array(n + 1)
      .fill(0)
      .map(() => Array(capacity + 1).fill(0));

    // Fill DP table
    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        setCurrentCell({ i, w });
        setDpTable(dp.map((row) => [...row]));
        await sleep(2000 - speed[0] * 18);

        const item = items[i - 1];
        if (item.weight <= w) {
          dp[i][w] = Math.max(
            dp[i - 1][w],
            dp[i - 1][w - item.weight] + item.value
          );
        } else {
          dp[i][w] = dp[i - 1][w];
        }

        setDpTable(dp.map((row) => [...row]));
        await sleep(2000 - speed[0] * 18);
      }
    }

    // Backtrack to find selected items
    const selected: boolean[] = Array(n).fill(false);
    let w = capacity;
    for (let i = n; i > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected[i - 1] = true;
        w -= items[i - 1].weight;
        setSelectedItems([...selected]);
        await sleep(2000 - speed[0] * 18);
      }
    }

    setMaxValue(dp[n][capacity]);
    setCurrentCell(null);
    setRunning(false);
  };

  const reset = () => {
    setDpTable([]);
    setSelectedItems([]);
    setCurrentCell(null);
    setMaxValue(0);
  };

  return (
    <div className="space-y-4">
      {/* Items display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-2">
          Items (Capacity: {capacity})
        </div>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              animate={{
                scale: selectedItems[idx] ? 1.05 : 1,
                backgroundColor: selectedItems[idx] ? '#10B981' : '#E5E7EB',
              }}
              className="p-3 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <span className={selectedItems[idx] ? 'text-white font-bold' : 'text-gray-700'}>
                  {item.name}
                </span>
                {selectedItems[idx] && <span className="text-white">✓</span>}
              </div>
              <div className={`text-sm ${selectedItems[idx] ? 'text-white' : 'text-gray-500'}`}>
                W: {item.weight}, V: {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DP Table */}
      {dpTable.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
          <div className="text-sm text-gray-600 mb-2">DP Table</div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="border p-1 bg-gray-200">i/w</th>
                {Array.from({ length: capacity + 1 }, (_, i) => (
                  <th key={i} className="border p-1 bg-gray-200">
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dpTable.map((row, i) => (
                <tr key={i}>
                  <td className="border p-1 bg-gray-200 font-bold">{i}</td>
                  {row.map((cell, w) => (
                    <td
                      key={w}
                      className={`border p-1 text-center ${
                        currentCell?.i === i && currentCell?.w === w
                          ? 'bg-yellow-300'
                          : i > 0 && w === capacity && cell > 0
                          ? 'bg-green-200'
                          : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {maxValue > 0 && (
        <div className="p-3 bg-green-100 text-green-800 rounded-lg">
          <strong>Maximum Value:</strong> {maxValue}
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Speed:</span>
        <Slider value={speed} onValueChange={setSpeed} min={1} max={100} step={1} className="flex-1" disabled={running} />
        <span className="text-sm text-gray-600 w-12">{speed[0]}%</span>
      </div>

      <div className="flex gap-2">
        <Button onClick={solveKnapsack} disabled={running} className="gap-2">
          <Play className="w-4 h-4" />
          {running ? 'Solving...' : 'Solve'}
        </Button>
        <Button onClick={reset} disabled={running} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>0/1 Knapsack (Dynamic Programming):</strong> Select items to maximize value without
        exceeding capacity. Time: O(nW), Space: O(nW)
      </div>
    </div>
  );
}
