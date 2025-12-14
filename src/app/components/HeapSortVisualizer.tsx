import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { Slider } from './ui/slider';
import React from 'react';

export function HeapSortVisualizer() {
  const [array, setArray] = useState<number[]>([55, 25, 29, 19, 22, 24]);
  const [sorting, setSorting] = useState(false);
  const [heapifying, setHeapifying] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [speed, setSpeed] = useState([30]);
  const [message, setMessage] = useState('');

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const heapify = async (arr: number[], n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    setHeapifying([i, left, right]);
    setMessage(`Heapifying at index ${i}`);
    await sleep(2000 - speed[0] * 18);

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(2000 - speed[0] * 18);
      await heapify(arr, n, largest);
    }
  };

  const heapSort = async () => {
    setSorting(true);
    setSorted([]);
    const arr = [...array];
    const n = arr.length;

    // Build max heap
    setMessage('Building Max Heap...');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    // Extract elements from heap
    setMessage('Extracting elements...');
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      setSorted((prev) => [...prev, i]);
      await sleep(2000 - speed[0] * 18);
      await heapify(arr, i, 0);
    }

    setSorted(Array.from({ length: n }, (_, i) => i));
    setHeapifying([]);
    setMessage('Sorting complete!');
    setSorting(false);
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setSorted([]);
    setHeapifying([]);
    setMessage('');
  };

  const reset = () => {
    setSorting(false);
    setSorted([]);
    setHeapifying([]);
    setMessage('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-end justify-around gap-2">
        {array.map((value, index) => (
          <motion.div
            key={`${value}-${index}`}
            layout
            animate={{
              scale: heapifying.includes(index) ? 1.15 : 1,
              height: `${(value / 100) * 180}px`,
            }}
            className={`flex-1 rounded-t-lg flex flex-col items-center justify-end pb-2 ${
              sorted.includes(index)
                ? 'bg-green-500'
                : heapifying.includes(index)
                ? 'bg-yellow-500'
                : 'bg-indigo-500'
            } text-white`}
          >
            <span>{value}</span>
          </motion.div>
        ))}
      </div>

      {message && (
        <div className="p-2 rounded bg-blue-100 text-blue-800 text-sm">{message}</div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Speed:</span>
        <Slider value={speed} onValueChange={setSpeed} min={1} max={100} step={1} className="flex-1" disabled={sorting} />
        <span className="text-sm text-gray-600 w-12">{speed[0]}%</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={heapSort} disabled={sorting} className="gap-2">
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

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Heap Sort:</strong> Builds a max heap, then repeatedly extracts the maximum element. Time: O(n log n)
      </div>
    </div>
  );
}
