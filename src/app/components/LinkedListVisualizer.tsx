import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, RotateCcw, ArrowRight } from 'lucide-react';

interface Node {
  value: number;
  id: string;
}

export function LinkedListVisualizer() {
  const [list, setList] = useState<Node[]>([
    { value: 10, id: '1' },
    { value: 20, id: '2' },
    { value: 30, id: '3' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');

  const insertAtEnd = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    if (list.length >= 8) {
      setMessage('List is full!');
      return;
    }
    const newNode = { value, id: Date.now().toString() };
    setList([...list, newNode]);
    setInputValue('');
    setMessage(`Inserted ${value} at end`);
  };

  const insertAtBeginning = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }
    if (list.length >= 8) {
      setMessage('List is full!');
      return;
    }
    const newNode = { value, id: Date.now().toString() };
    setList([newNode, ...list]);
    setInputValue('');
    setMessage(`Inserted ${value} at beginning`);
  };

  const deleteNode = (id: string) => {
    const node = list.find((n) => n.id === id);
    setList(list.filter((n) => n.id !== id));
    setMessage(`Deleted node with value ${node?.value}`);
  };

  const reset = () => {
    setList([
      { value: 10, id: '1' },
      { value: 20, id: '2' },
      { value: 30, id: '3' },
    ]);
    setInputValue('');
    setMessage('List reset');
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-56 overflow-x-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="text-sm text-gray-600">HEAD →</div>
        </div>

        <div className="flex items-center justify-start gap-2 min-w-max mx-auto w-fit">
          <AnimatePresence mode="popLayout">
            {list.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.5, x: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {/* Node */}
                <div className="relative group">
                  <div
                    className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center ${
                      index === 0
                        ? 'bg-green-500'
                        : index === list.length - 1
                        ? 'bg-red-500'
                        : 'bg-indigo-500'
                    } text-white shadow-lg`}
                  >
                    <div>{node.value}</div>
                    <div className="text-xs opacity-70">Node {index}</div>
                  </div>
                  <button
                    onClick={() => deleteNode(node.id)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Arrow */}
                {index < list.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {list.length === 0 && (
            <div className="text-gray-400 italic">List is empty</div>
          )}

          {list.length > 0 && (
            <div className="text-gray-400 ml-2">→ NULL</div>
          )}
        </div>

        <div className="text-sm text-gray-600 mt-4 text-center">
          Length: {list.length} nodes
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

      {/* Input */}
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Enter value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && insertAtEnd()}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={insertAtBeginning} className="gap-2">
          <Plus className="w-4 h-4" />
          Insert at Head
        </Button>
        <Button onClick={insertAtEnd} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Insert at Tail
        </Button>
        <Button onClick={reset} variant="outline" className="gap-2 col-span-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Head</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Tail</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded"></div>
          <span>Middle</span>
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Linked List:</strong> Collection of nodes where each node contains data and a pointer to the next node.
        Click the × button on any node to delete it.
      </div>
    </div>
  );
}
