import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const enqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    if (queue.length >= 8) {
      setMessage('Queue is full!');
      return;
    }
    setQueue([...queue, value]);
    setInputValue('');
    setMessage(`Enqueued ${value}`);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty!');
      return;
    }
    const value = queue[0];
    setQueue(queue.slice(1));
    setMessage(`Dequeued ${value}`);
  };

  const reset = () => {
    setQueue([10, 20, 30]);
    setInputValue('');
    setMessage('Queue reset');
  };

  const peek = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty!');
      return;
    }
    setMessage(`Front element: ${queue[0]}`);
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-48">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-red-600">← FRONT (Dequeue)</div>
          <div className="text-sm text-gray-600">Size: {queue.length}/8</div>
          <div className="text-sm text-green-600">REAR (Enqueue) →</div>
        </div>

        {/* Queue elements */}
        <div className="flex gap-2 justify-center items-center min-h-20">
          <AnimatePresence mode="popLayout">
            {queue.map((value, index) => (
              <motion.div
                key={`${value}-${index}`}
                initial={{ opacity: 0, x: 100, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                transition={{ duration: 0.3 }}
                className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                  index === 0
                    ? 'bg-red-500 ring-4 ring-red-300'
                    : index === queue.length - 1
                    ? 'bg-green-500 ring-4 ring-green-300'
                    : 'bg-indigo-500'
                } text-white shadow-lg`}
              >
                {value}
              </motion.div>
            ))}
          </AnimatePresence>

          {queue.length === 0 && (
            <div className="text-gray-400 italic">Queue is empty</div>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-blue-100 text-blue-800 text-sm"
        >
          {message}
        </motion.div>
      )}

      {/* Input and Controls */}
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && enqueue()}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={enqueue} className="gap-2">
          <Plus className="w-4 h-4" />
          Enqueue
        </Button>
        <Button onClick={dequeue} variant="outline" className="gap-2">
          <Minus className="w-4 h-4" />
          Dequeue
        </Button>
        <Button onClick={peek} variant="outline">
          Peek Front
        </Button>
        <Button onClick={reset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Front</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Rear</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Middle</span>
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Queue (FIFO):</strong> First element added is the first to be removed.
        Operations: Enqueue (add to rear), Dequeue (remove from front), Peek (view front).
      </div>
    </div>
  );
}
