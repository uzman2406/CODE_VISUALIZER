import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Shuffle } from 'lucide-react';
import { Slider } from './ui/slider';
import React from 'react';

export function BubbleSortVisualizer() {
  const [array, setArray] = useState<number[]>([64, 34, 25, 19, 22, 17, 90, 88]);
  const [sorting, setSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState({ i: -1, j: -1 });
  const [sorted, setSorted] = useState<number[]>([]);
  const [speed, setSpeed] = useState([30]); // Changed default from 50 to 30 (slower)

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    setSorted([]);
    setCurrentStep({ i: -1, j: -1 });
  };

  const reset = () => {
    setSorting(false);
    setSorted([]);
    setCurrentStep({ i: -1, j: -1 });
  };

  const bubbleSort = async () => {
    setSorting(true);
    setSorted([]);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentStep({ i, j });
        await new Promise((resolve) => setTimeout(resolve, 2000 - speed[0] * 18)); // Slower calculation

        if (arr[j] > arr[j + 1]) {
          // Swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise((resolve) => setTimeout(resolve, 2000 - speed[0] * 18)); // Slower calculation
        }
      }
      setSorted((prev) => [...prev, n - i - 1]);
    }

    setSorted(Array.from({ length: n }, (_, i) => i));
    setCurrentStep({ i: -1, j: -1 });
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
            initial={{ scale: 0.8 }}
            animate={{
              scale:
                currentStep.j === index || currentStep.j + 1 === index ? 1.1 : 1,
              height: `${(value / 100) * 180}px`,
            }}
            transition={{ duration: 0.3 }}
            className={`flex-1 rounded-t-lg flex flex-col items-center justify-end pb-2 ${
              sorted.includes(index)
                ? 'bg-green-500'
                : currentStep.j === index || currentStep.j + 1 === index
                ? 'bg-yellow-500'
                : 'bg-indigo-500'
            }`}
          >
            <span className="text-white">{value}</span>
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
        <Button
          onClick={bubbleSort}
          disabled={sorting}
          className="gap-2"
        >
          {sorting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Unsorted</span>
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