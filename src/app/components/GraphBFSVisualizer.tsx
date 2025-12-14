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

export function GraphBFSVisualizer() {
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
  const [queue, setQueue] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState([30]);
  const [path, setPath] = useState<string>('');

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const bfs = async () => {
    setRunning(true);
    setVisited([]);
    setCurrent(-1);
    setQueue([]);
    setPath('');

    const visitedSet = new Set<number>();
    const queueArr: number[] = [0]; // Start from node 0
    const pathArr: number[] = [];

    visitedSet.add(0);
    setVisited([0]);

    while (queueArr.length > 0) {
      setQueue([...queueArr]);
      await sleep(2000 - speed[0] * 18);

      const node = queueArr.shift()!;
      setCurrent(node);
      pathArr.push(node);
      setPath(pathArr.join(' → '));
      await sleep(2000 - speed[0] * 18);

      // Add neighbors to queue
      for (const neighbor of nodes[node].neighbors) {
        if (!visitedSet.has(neighbor)) {
          visitedSet.add(neighbor);
          queueArr.push(neighbor);
          setVisited([...visitedSet]);
          setQueue([...queueArr]);
          await sleep(2000 - speed[0] * 18);
        }
      }
    }

    setCurrent(-1);
    setQueue([]);
    setRunning(false);
  };

  const reset = () => {
    setVisited([]);
    setCurrent(-1);
    setQueue([]);
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
                    : queue.includes(node.id)
                    ? '#EC4899'
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

        {/* Queue visualization */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
          <div className="text-xs text-gray-600 mb-2">Queue:</div>
          <div className="flex gap-1">
            {queue.length === 0 ? (
              <div className="text-xs text-gray-400">Empty</div>
            ) : (
              queue.map((item, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 bg-pink-500 text-white rounded flex items-center justify-center text-sm"
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
          <strong>BFS Path:</strong> {path}
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
        <Button onClick={bfs} disabled={running} className="gap-2">
          <Play className="w-4 h-4" />
          {running ? 'Running...' : 'Start BFS'}
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
          <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
          <span>In Queue</span>
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
        <strong>Breadth-First Search (BFS):</strong> Explores all neighbors at the current depth
        before moving to nodes at the next depth level. Uses a queue (FIFO). Time: O(V + E)
      </div>
    </div>
  );
}