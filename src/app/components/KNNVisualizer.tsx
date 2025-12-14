import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Plus } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  label: 'A' | 'B';
}

export function KNNVisualizer() {
  const [points, setPoints] = useState<Point[]>([
    { x: 50, y: 50, label: 'A' },
    { x: 80, y: 60, label: 'A' },
    { x: 60, y: 80, label: 'A' },
    { x: 150, y: 150, label: 'B' },
    { x: 170, y: 160, label: 'B' },
    { x: 180, y: 140, label: 'B' },
  ]);
  const [testPoint, setTestPoint] = useState<{ x: number; y: number } | null>(null);
  const [k, setK] = useState(3);
  const [nearest, setNearest] = useState<number[]>([]);
  const [prediction, setPrediction] = useState<'A' | 'B' | null>(null);
  const [distances, setDistances] = useState<number[]>([]);

  const distance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const classify = () => {
    if (!testPoint) return;

    // Calculate distances
    const dists = points.map((p, idx) => ({
      idx,
      dist: distance(testPoint, p),
    }));

    // Sort by distance
    dists.sort((a, b) => a.dist - b.dist);

    // Get k nearest
    const kNearest = dists.slice(0, k);
    setNearest(kNearest.map((d) => d.idx));
    setDistances(dists.map((d) => d.dist));

    // Vote
    const votes = { A: 0, B: 0 };
    kNearest.forEach((d) => {
      votes[points[d.idx].label]++;
    });

    setPrediction(votes.A > votes.B ? 'A' : 'B');
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTestPoint({ x, y });
    setNearest([]);
    setPrediction(null);
    setDistances([]);
  };

  const reset = () => {
    setTestPoint(null);
    setNearest([]);
    setPrediction(null);
    setDistances([]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-2">
          Click anywhere on the canvas to add a test point
        </div>
        <svg
          width="400"
          height="300"
          className="bg-white border-2 border-gray-300 rounded cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {/* Draw lines to nearest neighbors */}
          {testPoint &&
            nearest.map((idx) => (
              <line
                key={idx}
                x1={testPoint.x}
                y1={testPoint.y}
                x2={points[idx].x}
                y2={points[idx].y}
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="4"
              />
            ))}

          {/* Draw training points */}
          {points.map((point, idx) => (
            <g key={idx}>
              <motion.circle
                animate={{
                  scale: nearest.includes(idx) ? 1.3 : 1,
                }}
                transition={{ duration: 0.3 }}
                cx={point.x}
                cy={point.y}
                r="8"
                fill={point.label === 'A' ? '#3B82F6' : '#EF4444'}
                stroke={nearest.includes(idx) ? '#F59E0B' : 'transparent'}
                strokeWidth={nearest.includes(idx) ? 3 : 0}
              />
              <text
                x={point.x}
                y={point.y + 20}
                fontSize="10"
                textAnchor="middle"
                fill="#666"
              >
                {nearest.includes(idx) && distances[idx]
                  ? distances[idx].toFixed(1)
                  : ''}
              </text>
            </g>
          ))}

          {/* Draw test point */}
          {testPoint && (
            <motion.circle
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              cx={testPoint.x}
              cy={testPoint.y}
              r="10"
              fill={prediction === 'A' ? '#3B82F6' : prediction === 'B' ? '#EF4444' : '#10B981'}
              stroke="black"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>

      {prediction && (
        <div
          className={`p-3 rounded-lg ${
            prediction === 'A' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <strong>Prediction: Class {prediction}</strong>
        </div>
      )}

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">K (neighbors):</span>
        <select
          value={k}
          onChange={(e) => setK(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        >
          <option value="1">1</option>
          <option value="3">3</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button onClick={classify} disabled={!testPoint} className="gap-2">
          <Play className="w-4 h-4" />
          Classify
        </Button>
        <Button onClick={reset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Class A</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Class B</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Test Point</span>
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>K-Nearest Neighbors (KNN):</strong> Instance-based learning that classifies based on
        majority vote of k nearest neighbors. Time: O(n) per query
      </div>
    </div>
  );
}