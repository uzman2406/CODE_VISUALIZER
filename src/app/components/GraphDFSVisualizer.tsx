import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';

interface GraphNode {
  id: number;
  x: number;
  y: number;
  neighbors: number[];
}

export function GraphDFSVisualizer() {
  const nodes: GraphNode[] = [
    { id: 0, x: 150, y: 50, neighbors: [1, 2] },
    { id: 1, x: 80, y: 150, neighbors: [0, 3, 4] },
    { id: 2, x: 220, y: 150, neighbors: [0, 5] },
    { id: 3, x: 30, y: 250, neighbors: [1] },
    { id: 4, x: 130, y: 250, neighbors: [1, 5] },
    { id: 5, x: 220, y: 250, neighbors: [2, 4] },
  ];

  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number>(-1);
  const [stack, setStack] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState([30]);
  const [path, setPath] = useState<string>('');

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const dfs = async () => {
    setRunning(true);
    setVisited([]);
    setCurrent(-1);
    setStack([]);
    setPath('');

    const visitedSet = new Set<number>();
    const stackArr: number[] = [0]; // Start from node 0
    const pathArr: number[] = [];

    while (stackArr.length > 0) {
      setStack([...stackArr]);
      await sleep(2000 - speed[0] * 18);

      const node = stackArr.pop()!;
      setCurrent(node);
      await sleep(2000 - speed[0] * 18);

      if (!visitedSet.has(node)) {
        visitedSet.add(node);
        pathArr.push(node);
        setVisited([...visitedSet]);
        setPath(pathArr.join(' → '));
        await sleep(2000 - speed[0] * 18);

        // Add neighbors to stack in reverse order
        const neighbors = [...nodes[node].neighbors].reverse();
        for (const neighbor of neighbors) {
          if (!visitedSet.has(neighbor)) {
            stackArr.push(neighbor);
          }
        }
      }
    }

    setCurrent(-1);
    setStack([]);
    setRunning(false);
  };

  const reset = () => {
    setVisited([]);
    setCurrent(-1);
    setStack([]);
    setPath('');
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 h-80 relative">
        <svg width="300" height="320" className="mx-auto">
          {/* Draw edges */}
          {nodes.map((node) =>
            node.neighbors.map((neighbor) => (
              <line
                key={`${node.id}-${neighbor}`}
                x1={node.x}
                y1={node.y}
                x2={nodes[neighbor].x}
                y2={nodes[neighbor].y}
                stroke="#9CA3AF"
                strokeWidth="2"
              />
            ))
          )}

          {/* Draw nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <motion.circle
                animate={{
                  scale: current === node.id ? 1.3 : 1,
                  fill: visited.includes(node.id)
                    ? '#10B981'
                    : current === node.id
                    ? '#F59E0B'
                    : stack.includes(node.id)
                    ? '#8B5CF6'
                    : '#6366F1',
                }}
                transition={{ duration: 0.3 }}
                cx={node.x}
                cy={node.y}
                r="20"
                stroke="transparent"
                strokeWidth={0}
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dy=".3em"
                fill="white"
                fontSize="14"
              >
                {node.id}
              </text>
            </g>
          ))}
        </svg>

        {/* Stack visualization */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
          <div className="text-xs text-gray-600 mb-2">Stack:</div>
          <div className="flex flex-col-reverse gap-1">
            {stack.length === 0 ? (
              <div className="text-xs text-gray-400">Empty</div>
            ) : (
              stack.map((item, idx) => (
                <div
                  key={idx}
                  className="w-12 h-8 bg-purple-500 text-white rounded flex items-center justify-center text-sm"
                >
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Path display */}
      {path && (
        <div className="p-3 rounded-lg bg-blue-100 text-blue-800 text-sm">
          <strong>DFS Path:</strong> {path}
        </div>
      )}

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
          disabled={running}
        />
        <span className="text-sm text-gray-600 w-12">{speed[0]}%</span>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button onClick={dfs} disabled={running} className="gap-2">
          <Play className="w-4 h-4" />
          {running ? 'Running...' : 'Start DFS'}
        </Button>
        <Button onClick={reset} disabled={running} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
          <span>In Stack</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Visited</span>
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Depth-First Search (DFS):</strong> Explores as far as possible along each branch
        before backtracking. Uses a stack (LIFO). Time: O(V + E)
      </div>
    </div>
  );
}