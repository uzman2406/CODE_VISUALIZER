import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { Input } from './ui/input';

export function LinearSearchVisualizer() {
  const [array, setArray] = useState([23, 67, 12, 89, 45, 34, 78, 56]);
  const [searchValue, setSearchValue] = useState('45');
  const [searching, setSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [found, setFound] = useState(-1);
  const [message, setMessage] = useState('');

  const reset = () => {
    setSearching(false);
    setCurrentIndex(-1);
    setFound(-1);
    setMessage('');
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(newArray);
    reset();
  };

  const linearSearch = async () => {
    reset();
    setSearching(true);
    const target = parseInt(searchValue);

    if (isNaN(target)) {
      setMessage('Please enter a valid number');
      setSearching(false);
      return;
    }

    for (let i = 0; i < array.length; i++) {
      setCurrentIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (array[i] === target) {
        setFound(i);
        setMessage(`Found ${target} at index ${i}! 🎉`);
        setSearching(false);
        return;
      }
    }

    setMessage(`Value ${target} not found in array`);
    setCurrentIndex(-1);
    setSearching(false);
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-48">
        <div className="flex justify-around gap-2 mb-6">
          {array.map((value, index) => (
            <motion.div
              key={index}
              animate={{
                scale: found === index ? 1.2 : currentIndex === index ? 1.15 : 1,
                y: currentIndex === index ? -10 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                found === index
                  ? 'bg-green-500 text-white'
                  : currentIndex === index
                  ? 'bg-yellow-500 text-white'
                  : index < currentIndex
                  ? 'bg-red-300 text-white'
                  : 'bg-indigo-500 text-white'
              }`}
            >
              {value}
            </motion.div>
          ))}
        </div>

        {currentIndex !== -1 && (
          <div className="text-sm text-gray-600 mb-2">
            Checking index {currentIndex}: value = {array[currentIndex]}
          </div>
        )}

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
      <div className="flex gap-2 flex-wrap">
        <Button onClick={linearSearch} disabled={searching} className="gap-2">
          <Play className="w-4 h-4" />
          {searching ? 'Searching...' : 'Search'}
        </Button>
        <Button onClick={reset} disabled={searching} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button onClick={generateRandomArray} disabled={searching} variant="outline" className="gap-2">
          <Shuffle className="w-4 h-4" />
          Shuffle
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Not Checked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Checking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 rounded"></div>
          <span>Not Match</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Found</span>
        </div>
      </div>
    </div>
  );
}
