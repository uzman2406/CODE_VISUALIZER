import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
}

export function BinaryTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>({
    value: 50,
    id: '1',
    left: {
      value: 30,
      id: '2',
      left: { value: 20, id: '4', left: null, right: null },
      right: { value: 40, id: '5', left: null, right: null },
    },
    right: {
      value: 70,
      id: '3',
      left: { value: 60, id: '6', left: null, right: null },
      right: { value: 80, id: '7', left: null, right: null },
    },
  });
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([]);

  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (node === null) {
      return {
        value,
        id: Date.now().toString(),
        left: null,
        right: null,
      };
    }

    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    }

    return node;
  };

  const insert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('Please enter a valid number');
      return;
    }

    if (root === null) {
      setRoot({
        value,
        id: Date.now().toString(),
        left: null,
        right: null,
      });
    } else {
      const newRoot = JSON.parse(JSON.stringify(root));
      insertNode(newRoot, value);
      setRoot(newRoot);
    }

    setInputValue('');
    setMessage(`Inserted ${value} into tree`);
  };

  const reset = () => {
    setRoot({
      value: 50,
      id: '1',
      left: {
        value: 30,
        id: '2',
        left: { value: 20, id: '4', left: null, right: null },
        right: { value: 40, id: '5', left: null, right: null },
      },
      right: {
        value: 70,
        id: '3',
        left: { value: 60, id: '6', left: null, right: null },
        right: { value: 80, id: '7', left: null, right: null },
      },
    });
    setInputValue('');
    setMessage('Tree reset');
    setHighlightedNodes([]);
  };

  const clear = () => {
    setRoot(null);
    setInputValue('');
    setMessage('Tree cleared');
    setHighlightedNodes([]);
  };

  const inorderTraversal = async (node: TreeNode | null, result: number[] = []): Promise<number[]> => {
    if (node !== null) {
      await inorderTraversal(node.left, result);
      setHighlightedNodes([node.id]);
      await new Promise((resolve) => setTimeout(resolve, 500));
      result.push(node.value);
      await inorderTraversal(node.right, result);
    }
    return result;
  };

  const traverseInorder = async () => {
    setHighlightedNodes([]);
    const result = await inorderTraversal(root);
    setMessage(`Inorder Traversal: ${result.join(' → ')}`);
    setHighlightedNodes([]);
  };

  const renderNode = (node: TreeNode | null, x: number, y: number, spacing: number): JSX.Element | null => {
    if (node === null) return null;

    const isHighlighted = highlightedNodes.includes(node.id);

    return (
      <g key={node.id}>
        {/* Lines to children */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={x - spacing}
            y2={y + 80}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={x + spacing}
            y2={y + 80}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}

        {/* Node circle */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{
            scale: isHighlighted ? 1.2 : 1,
            fill: isHighlighted ? '#F59E0B' : '#6366F1',
          }}
          transition={{ duration: 0.3 }}
          cx={x}
          cy={y}
          r="25"
          className="cursor-pointer"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dy=".3em"
          fill="white"
          fontSize="16"
        >
          {node.value}
        </text>

        {/* Recursive rendering of children */}
        {renderNode(node.left, x - spacing, y + 80, spacing / 2)}
        {renderNode(node.right, x + spacing, y + 80, spacing / 2)}
      </g>
    );
  };

  const countNodes = (node: TreeNode | null): number => {
    if (node === null) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-96 overflow-x-auto">
        <div className="flex justify-center items-center min-h-80">
          {root ? (
            <svg width="600" height="400" className="mx-auto">
              {renderNode(root, 300, 40, 100)}
            </svg>
          ) : (
            <div className="text-gray-400 italic">Tree is empty</div>
          )}
        </div>
        <div className="text-sm text-gray-600 text-center">
          Total nodes: {countNodes(root)}
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
          placeholder="Enter value to insert"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && insert()}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={insert} className="gap-2">
          <Plus className="w-4 h-4" />
          Insert Node
        </Button>
        <Button onClick={traverseInorder} variant="outline">
          Inorder Traversal
        </Button>
        <Button onClick={reset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        <Button onClick={clear} variant="outline" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Binary Search Tree:</strong> A tree where each node has at most two children.
        Left child &lt; parent &lt; right child. Inorder traversal visits nodes in sorted order.
      </div>
    </div>
  );
}
