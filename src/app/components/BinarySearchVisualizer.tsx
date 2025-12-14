import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { Input } from './ui/input';

export function BinarySearchVisualizer() {
  const sortedArray = [5, 12, 18, 23, 31, 45, 67, 78, 89, 92];
  const [searchValue, setSearchValue] = useState('45');
  const [searching, setSearching] = useState(false);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [found, setFound] = useState(-1);
  const [message, setMessage] = useState('');

  const reset = () => {
    setSearching(false);
    setLeft(-1);
    setRight(-1);
    setMid(-1);
    setFound(-1);
    setMessage('');
  };

  const binarySearch = async () => {
    reset();
    setSearching(true);
    const target = parseInt(searchValue);

    if (isNaN(target)) {
      setMessage('Please enter a valid number');
      setSearching(false);
      return;
    }

    let l = 0;
    let r = sortedArray.length - 1;

    while (l <= r) {
      setLeft(l);
      setRight(r);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const m = Math.floor((l + r) / 2);
      setMid(m);
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (sortedArray[m] === target) {
        setFound(m);
        setMessage(`Found ${target} at index ${m}! 🎉`);
        setSearching(false);
        return;
      }

      if (sortedArray[m] < target) {
        l = m + 1;
      } else {
        r = m - 1;
      }
    }

    setMessage(`Value ${target} not found in array`);
    setSearching(false);
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-48">
        <div className="flex justify-around gap-1 mb-6">
          {sortedArray.map((value, index) => (
            <motion.div
              key={index}
              animate={{
                scale:
                  found === index
                    ? 1.2
                    : mid === index
                    ? 1.15
                    : left === index || right === index
                    ? 1.1
                    : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                found === index
                  ? 'bg-green-500 text-white'
                  : mid === index
                  ? 'bg-yellow-500 text-white'
                  : index >= (left === -1 ? 0 : left) && index <= (right === -1 ? sortedArray.length - 1 : right)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {value}
            </motion.div>
          ))}
        </div>

        {/* Pointers */}
        <div className="space-y-2 text-sm">
          {left !== -1 && <div className="text-blue-600">Left pointer: index {left} (value: {sortedArray[left]})</div>}
          {right !== -1 && <div className="text-purple-600">Right pointer: index {right} (value: {sortedArray[right]})</div>}
          {mid !== -1 && <div className="text-yellow-600">Mid pointer: index {mid} (value: {sortedArray[mid]})</div>}
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-3 rounded-lg ${
              found !== -1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>

      {/* Search Input */}
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Enter value to search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={searching}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={binarySearch} disabled={searching} className="gap-2">
          <Play className="w-4 h-4" />
          {searching ? 'Searching...' : 'Search'}
        </Button>
        <Button onClick={reset} disabled={searching} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Search Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Mid Point</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Found</span>
        </div>
      </div>
    </div>
  );
}
