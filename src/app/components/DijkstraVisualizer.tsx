import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';

interface GraphNode {
  id: number;
  x: number;
  y: number;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

export function DijkstraVisualizer() {
  const nodes: GraphNode[] = [
    { id: 0, x: 80, y: 100 },
    { id: 1, x: 200, y: 50 },
    { id: 2, x: 200, y: 150 },
    { id: 3, x: 320, y: 100 },
    { id: 4, x: 440, y: 100 },
  ];

  const edges: Edge[] = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 1 },
    { from: 2, to: 1, weight: 2 },
    { from: 2, to: 3, weight: 5 },
    { from: 3, to: 4, weight: 3 },
  ];

  const [distances, setDistances] = useState<number[]>(Array(5).fill(Infinity));
  const [visited, setVisited] = useState<number[]>([]);
  const [current, setCurrent] = useState<number>(-1);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState([30]);
  const [pathEdges, setPathEdges] = useState<Set<string>>(new Set());

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const dijkstra = async () => {
    setRunning(true);
    const dist = Array(nodes.length).fill(Infinity);
    const visitedSet = new Set<number>();
    const parent: number[] = Array(nodes.length).fill(-1);
    
    dist[0] = 0;
    setDistances([...dist]);
    await sleep(2000 - speed[0] * 18);

    for (let i = 0; i < nodes.length; i++) {
      let minDist = Infinity;
      let minNode = -1;

      // Find unvisited node with minimum distance
      for (let j = 0; j < nodes.length; j++) {
        if (!visitedSet.has(j) && dist[j] < minDist) {
          minDist = dist[j];
          minNode = j;
        }
      }

      if (minNode === -1) break;

      setCurrent(minNode);
      await sleep(2000 - speed[0] * 18);

      visitedSet.add(minNode);
      setVisited([...visitedSet]);

      // Update distances to neighbors
      const neighbors = edges.filter((e) => e.from === minNode);
      for (const edge of neighbors) {
        const neighbor = edge.to;
        const newDist = dist[minNode] + edge.weight;

        if (newDist < dist[neighbor]) {
          dist[neighbor] = newDist;
          parent[neighbor] = minNode;
          setDistances([...dist]);
          
          // Add edge to path
          setPathEdges((prev) => new Set(prev).add(`${minNode}-${neighbor}`));
          await sleep(2000 - speed[0] * 18);
        }
      }
    }

    setCurrent(-1);
    setRunning(false);
  };

  const reset = () => {
    setDistances(Array(5).fill(Infinity));
    setVisited([]);
    setCurrent(-1);
    setPathEdges(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 h-80 relative">
        <svg width="500" height="250" className="mx-auto">
          {/* Draw edges */}
          {edges.map((edge, idx) => {
            const fromNode = nodes[edge.from];
            const toNode = nodes[edge.to];
            const isInPath = pathEdges.has(`${edge.from}-${edge.to}`);
            
            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isInPath ? '#10B981' : '#9CA3AF'}
                  strokeWidth={isInPath ? '3' : '2'}
                />
                {/* Edge weight label */}
                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 - 10}
                  fill="#6366F1"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => {
            const dist = distances[node.id];
            const isVisited = visited.includes(node.id);
            const isCurrent = current === node.id;

            return (
              <g key={node.id}>
                <motion.circle
                  animate={{
                    scale: isCurrent ? 1.3 : 1,
                    fill: isVisited ? '#10B981' : isCurrent ? '#F59E0B' : '#6366F1',
                  }}
                  transition={{ duration: 0.3 }}
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  stroke="transparent"
                  strokeWidth={0}
                />
                <text x={node.x} y={node.y - 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                  {node.id}
                </text>
                <text x={node.x} y={node.y + 10} textAnchor="middle" fill="white" fontSize="11">
                  {dist === Infinity ? '∞' : dist}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Speed:</span>
        <Slider value={speed} onValueChange={setSpeed} min={1} max={100} step={1} className="flex-1" disabled={running} />
        <span className="text-sm text-gray-600 w-12">{speed[0]}%</span>
      </div>

      <div className="flex gap-2">
        <Button onClick={dijkstra} disabled={running} className="gap-2">
          <Play className="w-4 h-4" />
          {running ? 'Running...' : 'Start Dijkstra'}
        </Button>
        <Button onClick={reset} disabled={running} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="flex gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
          <span>Unvisited</span>
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

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Dijkstra's Algorithm:</strong> Finds shortest path from source (node 0) to all other nodes.
        Greedy approach using priority queue. Time: O((V + E) log V)
      </div>
    </div>
  );
}