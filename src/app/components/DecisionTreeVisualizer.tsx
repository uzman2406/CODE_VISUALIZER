import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface TreeNode {
  feature?: string;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: string;
  x?: number;
  y?: number;
}

export function DecisionTreeVisualizer() {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [currentNode, setCurrentNode] = useState<TreeNode | null>(null);
  const [testData, setTestData] = useState({ age: 25, income: 50 });
  const [prediction, setPrediction] = useState<string | null>(null);

  // Sample decision tree for loan approval
  const sampleTree: TreeNode = {
    feature: 'Income',
    threshold: 40,
    left: {
      prediction: 'Reject',
    },
    right: {
      feature: 'Age',
      threshold: 30,
      left: {
        prediction: 'Review',
      },
      right: {
        prediction: 'Approve',
      },
    },
  };

  const buildTree = () => {
    // Add coordinates for visualization
    const addCoordinates = (node: TreeNode, x: number, y: number, offset: number): TreeNode => {
      const newNode = { ...node, x, y };
      if (node.left) {
        newNode.left = addCoordinates(node.left, x - offset, y + 80, offset / 2);
      }
      if (node.right) {
        newNode.right = addCoordinates(node.right, x + offset, y + 80, offset / 2);
      }
      return newNode;
    };

    const treeWithCoords = addCoordinates(sampleTree, 250, 50, 100);
    setTree(treeWithCoords);
    setPrediction(null);
    setCurrentNode(null);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const classify = async () => {
    if (!tree) return;

    let node = tree;
    setCurrentNode(node);
    await sleep(1000);

    while (node.feature) {
      const value = node.feature === 'Income' ? testData.income : testData.age;
      const threshold = node.threshold!;

      if (value <= threshold) {
        node = node.left!;
      } else {
        node = node.right!;
      }

      setCurrentNode(node);
      await sleep(1000);
    }

    setPrediction(node.prediction!);
    setCurrentNode(null);
  };

  const reset = () => {
    setCurrentNode(null);
    setPrediction(null);
  };

  const renderNode = (node: TreeNode | undefined): JSX.Element | null => {
    if (!node || !node.x || !node.y) return null;

    const isCurrentNode = currentNode === node;
    const isPrediction = node.prediction !== undefined;

    return (
      <g key={`${node.x}-${node.y}`}>
        {/* Lines to children */}
        {node.left && node.left.x && node.left.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}
        {node.right && node.right.x && node.right.y && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        )}

        {/* Node */}
        <motion.rect
          animate={{
            scale: isCurrentNode ? 1.1 : 1,
            fill: isCurrentNode
              ? '#F59E0B'
              : isPrediction
              ? node.prediction === 'Approve'
                ? '#10B981'
                : node.prediction === 'Reject'
                ? '#EF4444'
                : '#6366F1'
              : '#6366F1',
          }}
          transition={{ duration: 0.3 }}
          x={node.x - 40}
          y={node.y - 20}
          width="80"
          height="40"
          rx="5"
          stroke="transparent"
          strokeWidth={0}
        />

        {node.feature ? (
          <>
            <text
              x={node.x}
              y={node.y - 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              {node.feature}
            </text>
            <text x={node.x} y={node.y + 10} textAnchor="middle" fill="white" fontSize="11">
              ≤ {node.threshold}
            </text>
          </>
        ) : (
          <text
            x={node.x}
            y={node.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {node.prediction}
          </text>
        )}

        {/* Recursively render children */}
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 min-h-80">
        {tree ? (
          <svg width="500" height="300" className="mx-auto">
            {renderNode(tree)}
          </svg>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            Click "Build Tree" to start
          </div>
        )}
      </div>

      {/* Test Data Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Age:</label>
          <input
            type="number"
            value={testData.age}
            onChange={(e) => setTestData({ ...testData, age: parseInt(e.target.value) || 0 })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Income (k):</label>
          <input
            type="number"
            value={testData.income}
            onChange={(e) => setTestData({ ...testData, income: parseInt(e.target.value) || 0 })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {prediction && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-3 rounded-lg ${
            prediction === 'Approve'
              ? 'bg-green-100 text-green-800'
              : prediction === 'Reject'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <strong>Prediction: {prediction}</strong>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button onClick={buildTree} className="gap-2">
          <Play className="w-4 h-4" />
          Build Tree
        </Button>
        <Button onClick={classify} disabled={!tree || currentNode !== null} className="gap-2">
          <Play className="w-4 h-4" />
          Classify
        </Button>
        <Button onClick={reset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Decision Tree (ID3/C4.5):</strong> Builds tree by recursively splitting data based on
        information gain. Predictions follow path from root to leaf.
      </div>
    </div>
  );
}