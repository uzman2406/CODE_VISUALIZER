import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function StackVisualizer() {
  const [stack, setStack] = useState<number[]>([10, 20, 30]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const push = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    if (stack.length >= 8) {
      setMessage('Stack is full!');
      return;
    }
    setStack([...stack, value]);
    setInputValue('');
    setMessage(`Pushed ${value} onto stack`);
  };

  const pop = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    const value = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setMessage(`Popped ${value} from stack`);
  };

  const reset = () => {
    setStack([10, 20, 30]);
    setInputValue('');
    setMessage('Stack reset');
  };

  const peek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    setMessage(`Top element: ${stack[stack.length - 1]}`);
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-80 flex flex-col-reverse items-center justify-start relative">
        <div className="absolute top-4 right-4 text-sm text-gray-600">
          Size: {stack.length}/8
        </div>
        <div className="absolute top-4 left-4 text-sm text-purple-600">
          ↑ TOP (LIFO)
        </div>

        {/* Stack base */}
        <div className="w-48 h-2 bg-gray-400 rounded-full mb-2"></div>

        {/* Stack elements */}
        <AnimatePresence mode="popLayout">
          {stack.map((value, index) => (
            <motion.div
              key={`${value}-${index}`}
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`w-48 h-14 rounded-lg flex items-center justify-center ${
                index === stack.length - 1
                  ? 'bg-purple-500 ring-4 ring-purple-300'
                  : 'bg-indigo-500'
              } text-white mb-2 shadow-lg`}
            >
              <span>{value}</span>
            </motion.div>
          ))}
        </AnimatePresence>
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
          onKeyPress={(e) => e.key === 'Enter' && push()}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={push} className="gap-2">
          <Plus className="w-4 h-4" />
          Push
        </Button>
        <Button onClick={pop} variant="outline" className="gap-2">
          <Minus className="w-4 h-4" />
          Pop
        </Button>
        <Button onClick={peek} variant="outline">
          Peek Top
        </Button>
        <Button onClick={reset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Stack (LIFO):</strong> Last element added is the first to be removed.
        Operations: Push (add to top), Pop (remove from top), Peek (view top).
      </div>
    </div>
  );
}
