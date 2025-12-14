import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { Slider } from './ui/slider';
import React from 'react';

export function QuickSortVisualizer() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 19, 22, 17, 90, 88]);
  const [sorting, setSorting] = useState(false);
  const [pivot, setPivot] = useState(-1);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [speed, setSpeed] = useState([30]); // Changed default from 50 to 30

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setSorted([]);
    setPivot(-1);
    setComparing([]);
  };

  const reset = () => {
    setSorting(false);
    setSorted([]);
    setPivot(-1);
    setComparing([]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const partition = async (arr: number[], low: number, high: number): Promise<number> => {
    const pivotValue = arr[high];
    setPivot(high);
    await sleep(2000 - speed[0] * 18); // Slower calculation

    let i = low - 1;

    for (let j = low; j < high; j++) {
      setComparing([j, high]);
      await sleep(2000 - speed[0] * 18); // Slower calculation

      if (arr[j] < pivotValue) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(2000 - speed[0] * 18); // Slower calculation
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(2000 - speed[0] * 18); // Slower calculation

    return i + 1;
  };

  const quickSortHelper = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      setSorted((prev) => [...prev, pi]);

      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    } else if (low === high) {
      setSorted((prev) => [...prev, low]);
    }
  };

  const quickSort = async () => {
    setSorting(true);
    setSorted([]);
    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    setPivot(-1);
    setComparing([]);
    setSorting(false);
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-end justify-around gap-2">
        {array.map((value, index) => (
          <motion.div
            key={`${value}-${index}`}
            layout
            animate={{
              scale: pivot === index ? 1.15 : comparing.includes(index) ? 1.1 : 1,
              height: `${(value / 100) * 180}px`,
            }}
            transition={{ duration: 0.3 }}
            className={`flex-1 rounded-t-lg flex flex-col items-center justify-end pb-2 ${
              sorted.includes(index)
                ? 'bg-green-500'
                : pivot === index
                ? 'bg-purple-500'
                : comparing.includes(index)
                ? 'bg-yellow-500'
                : 'bg-indigo-500'
            } text-white`}
          >
            <span>{value}</span>
          </motion.div>
        ))}
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Speed:</span>
        <Slider
          value={speed}
          onValueChange={setSpeed}
          min={1}
          max={100}
          step={1}
          className="flex-1"
          disabled={sorting}
        />
        <span className="text-sm text-gray-600 w-12">{speed[0]}%</span>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={quickSort} disabled={sorting} className="gap-2">
          <Play className="w-4 h-4" />
          {sorting ? 'Sorting...' : 'Start'}
        </Button>
        <Button onClick={reset} disabled={sorting} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button onClick={generateRandomArray} disabled={sorting} variant="outline" className="gap-2">
          <Shuffle className="w-4 h-4" />
          Shuffle
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
}