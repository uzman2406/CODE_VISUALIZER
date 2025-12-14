import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Plus } from 'lucide-react';
import { Slider } from './ui/slider';

interface DataPoint {
  x: number;
  y: number;
}

export function LinearRegressionVisualizer() {
  const [points, setPoints] = useState<DataPoint[]>([
    { x: 20, y: 180 },
    { x: 50, y: 150 },
    { x: 80, y: 120 },
    { x: 110, y: 100 },
    { x: 140, y: 70 },
    { x: 170, y: 50 },
  ]);

  const [m, setM] = useState(0); // slope
  const [b, setB] = useState(200); // intercept
  const [training, setTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [learningRate, setLearningRate] = useState([50]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const calculateLoss = (slope: number, intercept: number) => {
    let totalError = 0;
    points.forEach((point) => {
      const predicted = slope * point.x + intercept;
      totalError += (point.y - predicted) ** 2;
    });
    return totalError / points.length;
  };

  const train = async () => {
    setTraining(true);
    let slope = 0;
    let intercept = 200;
    const lr = learningRate[0] / 10000; // Adjust learning rate

    for (let i = 0; i < 100; i++) {
      setEpoch(i + 1);

      // Calculate gradients
      let gradM = 0;
      let gradB = 0;

      points.forEach((point) => {
        const predicted = slope * point.x + intercept;
        const error = predicted - point.y;
        gradM += error * point.x;
        gradB += error;
      });

      gradM = (2 * gradM) / points.length;
      gradB = (2 * gradB) / points.length;

      // Update parameters
      slope -= lr * gradM;
      intercept -= lr * gradB;

      setM(slope);
      setB(intercept);
      setLoss(calculateLoss(slope, intercept));

      await sleep(100);
    }

    setTraining(false);
  };

  const reset = () => {
    setM(0);
    setB(200);
    setEpoch(0);
    setLoss(0);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (training) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints([...points, { x, y }]);
  };

  // Calculate line endpoints
  const lineY1 = m * 0 + b;
  const lineY2 = m * 400 + b;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-2">
          Click to add data points. Watch gradient descent fit the line!
        </div>
        <svg
          width="400"
          height="300"
          className="bg-white border-2 border-gray-300 rounded cursor-crosshair"
          onClick={handleCanvasClick}
        >
          {/* Draw regression line */}
          {(m !== 0 || b !== 200) && (
            <line
              x1="0"
              y1={Math.max(0, Math.min(300, lineY1))}
              x2="400"
              y2={Math.max(0, Math.min(300, lineY2))}
              stroke="#10B981"
              strokeWidth="2"
            />
          )}

          {/* Draw error lines */}
          {training &&
            points.map((point, idx) => {
              const predicted = m * point.x + b;
              return (
                <line
                  key={`error-${idx}`}
                  x1={point.x}
                  y1={point.y}
                  x2={point.x}
                  y2={predicted}
                  stroke="#EF4444"
                  strokeWidth="1"
                  strokeDasharray="2"
                  opacity="0.5"
                />
              );
            })}

          {/* Draw data points */}
          {points.map((point, idx) => (
            <motion.circle
              key={idx}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              cx={point.x}
              cy={point.y}
              r="6"
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="p-2 bg-blue-100 rounded">
          <div className="text-gray-600">Epoch</div>
          <div className="font-bold">{epoch}</div>
        </div>
        <div className="p-2 bg-green-100 rounded">
          <div className="text-gray-600">Loss (MSE)</div>
          <div className="font-bold">{loss.toFixed(2)}</div>
        </div>
        <div className="p-2 bg-purple-100 rounded">
          <div className="text-gray-600">Points</div>
          <div className="font-bold">{points.length}</div>
        </div>
      </div>

      {/* Model parameters */}
      <div className="p-3 bg-gray-100 rounded-lg text-sm">
        <div className="font-bold mb-1">Model: y = mx + b</div>
        <div>m (slope): {m.toFixed(4)}</div>
        <div>b (intercept): {b.toFixed(4)}</div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Learning Rate:</span>
        <Slider
          value={learningRate}
          onValueChange={setLearningRate}
          min={1}
          max={100}
          step={1}
          className="flex-1"
          disabled={training}
        />
        <span className="text-sm text-gray-600 w-12">{learningRate[0]}</span>
      </div>

      <div className="flex gap-2">
        <Button onClick={train} disabled={training || points.length < 2} className="gap-2">
          <Play className="w-4 h-4" />
          {training ? 'Training...' : 'Train Model'}
        </Button>
        <Button onClick={reset} disabled={training} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset Model
        </Button>
        <Button
          onClick={() => setPoints([])}
          disabled={training}
          variant="outline"
          className="gap-2"
        >
          Clear Points
        </Button>
      </div>

      <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <strong>Linear Regression (Gradient Descent):</strong> Finds best-fit line by minimizing
        Mean Squared Error. Updates: θ = θ - α∇J(θ)
      </div>
    </div>
  );
}
