import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { Slider } from './ui/slider';
import React from 'react';

export function MergeSortVisualizer() {
  const [array, setArray] = useState<number[]>([38, 27, 43, 19, 20, 82, 25, 52]);
  const [sorting, setSorting] = useState(false);
  const [comparing, setComparing] = useState<number[]>([]);
  const [merging, setMerging] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [speed, setSpeed] = useState([30]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setSorted([]);
    setComparing([]);
    setMerging([]);
  };

  const reset = () => {
    setSorting(false);
    setSorted([]);
    setComparing([]);
    setMerging([]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    // Highlight the range being merged
    const mergeRange = Array.from({ length: right - left + 1 }, (_, idx) => left + idx);
    setMerging(mergeRange);
    await sleep(2000 - speed[0] * 18);

    while (i < n1 && j < n2) {
      setComparing([left + i, mid + 1 + j]);
      await sleep(2000 - speed[0] * 18);

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      setArray([...arr]);
      k++;
      await sleep(2000 - speed[0] * 18);
    }

    while (i < n1) {
      arr[k] = leftArr[i];
      setArray([...arr]);
      i++;
      k++;
      await sleep(2000 - speed[0] * 18);
    }

    while (j < n2) {
      arr[k] = rightArr[j];
      setArray([...arr]);
      j++;
      k++;
      await sleep(2000 - speed[0] * 18);
    }

    // Mark this range as sorted
    setSorted((prev) => [...new Set([...prev, ...mergeRange])]);
    setMerging([]);
    setComparing([]);
  };

  const mergeSortHelper = async (arr: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      await mergeSortHelper(arr, left, mid);
      await mergeSortHelper(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    } else if (left === right) {
      setSorted((prev) => [...prev, left]);
    }
  };

  const mergeSort = async () => {
    setSorting(true);
    setSorted([]);
    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
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
              scale: comparing.includes(index) ? 1.15 : merging.includes(index) ? 1.08 : 1,
              height: `${(value / 100) * 180}px`,
            }}
            transition={{ duration: 0.3 }}
            className={`flex-1 rounded-t-lg flex flex-col items-center justify-end pb-2 ${
              sorted.includes(index)
                ? 'bg-green-500'
                : comparing.includes(index)
                ? 'bg-yellow-500'
                : merging.includes(index)
                ? 'bg-purple-500'
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
        <Button onClick={mergeSort} disabled={sorting} className="gap-2">
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
          <span>Merging</span>
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

      {/* Info */}
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Merge Sort:</strong> Divide-and-conquer algorithm that divides the array into halves,
        recursively sorts them, and then merges the sorted halves. Time: O(n log n)
      </div>
    </div>
  );
}
