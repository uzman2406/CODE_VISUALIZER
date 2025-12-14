# 📚 Guide: How to Add New Algorithms

This guide explains the architecture and step-by-step process to add new algorithm visualizers to your platform.

---

## 🏗️ Architecture Overview

The application follows a simple, scalable structure:

```
/src/app/
├── App.tsx                          # Main app with routing & algorithm registry
├── components/
│   ├── BubbleSortVisualizer.tsx    # Example algorithm component
│   ├── QuickSortVisualizer.tsx     # Another example
│   ├── [YourNewAlgo]Visualizer.tsx # Your new algorithm
│   └── ui/                         # Reusable UI components
│       ├── button.tsx
│       ├── slider.tsx
│       └── ...
```

---

## ✨ Step-by-Step: Adding a New Algorithm

### **Step 1: Create the Visualizer Component**

Create a new file in `/src/app/components/` named `[AlgorithmName]Visualizer.tsx`

**Template:**
```tsx
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { Slider } from './ui/slider';

export function MyNewAlgoVisualizer() {
  // State management
  const [data, setData] = useState<number[]>([5, 2, 8, 1, 9]);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState([30]); // Default speed: 30%

  // Helper: Sleep function for animation delays
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Main algorithm logic
  const runAlgorithm = async () => {
    setRunning(true);
    
    // Your algorithm implementation here
    for (let i = 0; i < data.length; i++) {
      setCurrentStep(i);
      // Calculate delay: slower at 1%, faster at 100%
      await sleep(2000 - speed[0] * 18);
      
      // Your logic...
    }
    
    setRunning(false);
  };

  // Reset function
  const reset = () => {
    setRunning(false);
    setCurrentStep(-1);
    // Reset any other state...
  };

  return (
    <div className="space-y-4">
      {/* Visualization Area */}
      <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
        {data.map((value, index) => (
          <motion.div
            key={index}
            animate={{
              scale: currentStep === index ? 1.2 : 1,
              backgroundColor: currentStep === index ? '#F59E0B' : '#6366F1',
            }}
            transition={{ duration: 0.3 }}
            className="w-14 h-14 rounded-lg flex items-center justify-center text-white m-1"
          >
            {value}
          </motion.div>
        ))}
      </div>

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
        <Button onClick={runAlgorithm} disabled={running}>
          <Play className="w-4 h-4 mr-2" />
          {running ? 'Running...' : 'Run'}
        </Button>
        <Button onClick={reset} disabled={running} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Algorithm Info */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>How it works:</strong> Explain your algorithm here...
      </div>
    </div>
  );
}
```

---

### **Step 2: Register in App.tsx**

Open `/src/app/App.tsx` and follow these substeps:

#### **2.1 Import Your Component**
At the top of the file, add:
```tsx
import { MyNewAlgoVisualizer } from './components/MyNewAlgoVisualizer';
```

#### **2.2 Import Icon (Optional)**
If you need a new icon from lucide-react:
```tsx
import { YourIcon } from 'lucide-react';
```

#### **2.3 Add to the `algorithms` Object**

Find the appropriate category (or create a new one) and add your algorithm:

```tsx
const algorithms = {
  sorting: [
    // ... existing algorithms
    {
      id: 'mynewsort',                          // Unique ID
      name: 'My New Sort Algorithm',            // Display name
      description: 'O(n²) - Your description',  // Short description with complexity
      component: MyNewAlgoVisualizer,           // Your component
      icon: YourIcon,                           // Icon from lucide-react
    },
  ],
  // ... other categories
};
```

---

### **Step 3: (Optional) Add New Category**

If your algorithm doesn't fit existing categories, create a new one:

#### **3.1 Add to `categories` array:**
```tsx
const categories = [
  // ... existing categories
  { id: 'mynewcategory', label: 'My Category', icon: YourIcon },
];
```

#### **3.2 Add to `algorithms` object:**
```tsx
const algorithms = {
  // ... existing categories
  mynewcategory: [
    {
      id: 'myalgo',
      name: 'My Algorithm',
      description: 'Algorithm description',
      component: MyAlgoVisualizer,
      icon: YourIcon,
    },
  ],
};
```

---

## 🎨 Design Patterns to Follow

### **1. Animation Speed Formula**
Always use this formula for consistent speed control across all visualizers:
```tsx
await sleep(2000 - speed[0] * 18);
```
- At `speed = 1%`: delay = 1,982ms (very slow)
- At `speed = 30%`: delay = 1,460ms (default)
- At `speed = 100%`: delay = 200ms (very fast)

### **2. Color Scheme**
Use consistent colors for states:
- **Active/Current**: `#F59E0B` (orange) or `bg-yellow-500`
- **Comparing**: `#6366F1` (indigo) or `bg-indigo-500`
- **Sorted/Complete**: `#10B981` (green) or `bg-green-500`
- **Default**: `#6366F1` (indigo) or `bg-indigo-500`

### **3. Motion/Framer Motion**
Always use Motion for smooth animations:
```tsx
import { motion } from 'motion/react';

<motion.div
  animate={{ scale: isActive ? 1.2 : 1 }}
  transition={{ duration: 0.3 }}
>
  {content}
</motion.div>
```

### **4. Standard Controls**
Include these controls in every visualizer:
- **Play/Run** button
- **Reset** button
- **Speed slider** (1-100%)
- Optional: **Shuffle/Generate Random** button

---

## 📦 Available UI Components

You have these reusable components in `/src/app/components/ui/`:

- `<Button>` - Primary buttons with variants
- `<Slider>` - Speed control slider
- `<Tabs>` - Tab navigation
- `<Card>` - Content cards
- `<Input>` - Text inputs
- `<Textarea>` - Multi-line text input

Import them like:
```tsx
import { Button } from './ui/button';
import { Slider } from './ui/slider';
```

---

## 🎯 Real Example: Adding Selection Sort

### **1. Create Component** (`/src/app/components/SelectionSortVisualizer.tsx`):

```tsx
import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { Slider } from './ui/slider';

export function SelectionSortVisualizer() {
  const [array, setArray] = useState<number[]>([64, 25, 12, 22, 11]);
  const [sorting, setSorting] = useState(false);
  const [currentMin, setCurrentMin] = useState(-1);
  const [comparing, setComparing] = useState(-1);
  const [sorted, setSorted] = useState<number[]>([]);
  const [speed, setSpeed] = useState([30]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const selectionSort = async () => {
    setSorting(true);
    const arr = [...array];
    
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      setCurrentMin(i);
      
      for (let j = i + 1; j < arr.length; j++) {
        setComparing(j);
        await sleep(2000 - speed[0] * 18);
        
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setCurrentMin(minIdx);
        }
      }
      
      // Swap
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      setSorted(prev => [...prev, i]);
      await sleep(2000 - speed[0] * 18);
    }
    
    setSorted(Array.from({ length: arr.length }, (_, i) => i));
    setSorting(false);
    setCurrentMin(-1);
    setComparing(-1);
  };

  const generateRandom = () => {
    const newArr = Array.from({ length: 8 }, () => 
      Math.floor(Math.random() * 100) + 10
    );
    setArray(newArr);
    setSorted([]);
    setCurrentMin(-1);
    setComparing(-1);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-end justify-around gap-2">
        {array.map((value, index) => (
          <motion.div
            key={index}
            animate={{
              scale: currentMin === index || comparing === index ? 1.1 : 1,
              height: `${(value / 100) * 180}px`,
            }}
            className={`flex-1 rounded-t-lg flex items-end justify-center pb-2 ${
              sorted.includes(index)
                ? 'bg-green-500'
                : currentMin === index
                ? 'bg-yellow-500'
                : comparing === index
                ? 'bg-orange-400'
                : 'bg-indigo-500'
            }`}
          >
            <span className="text-white">{value}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Speed:</span>
        <Slider
          value={speed}
          onValueChange={setSpeed}
          min={1}
          max={100}
          className="flex-1"
          disabled={sorting}
        />
        <span className="text-sm text-gray-600 w-12">{speed[0]}%</span>
      </div>

      <div className="flex gap-2">
        <Button onClick={selectionSort} disabled={sorting}>
          <Play className="w-4 h-4 mr-2" />
          {sorting ? 'Sorting...' : 'Sort'}
        </Button>
        <Button onClick={generateRandom} disabled={sorting} variant="outline">
          <Shuffle className="w-4 h-4 mr-2" />
          Random
        </Button>
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Selection Sort:</strong> Finds minimum element and swaps with first 
        unsorted position. O(n²) time complexity.
      </div>
    </div>
  );
}
```

### **2. Register in App.tsx**:

```tsx
// Add import
import { SelectionSortVisualizer } from './components/SelectionSortVisualizer';

// Add to algorithms.sorting array
const algorithms = {
  sorting: [
    // ... existing sorts
    {
      id: 'selection',
      name: 'Selection Sort',
      description: 'O(n²) - Find minimum and swap to sorted position',
      component: SelectionSortVisualizer,
      icon: ArrowRightLeft,
    },
  ],
  // ...
};
```

**Done!** Your new algorithm will appear in the Sorting tab.

---

## 🚀 Quick Checklist

When adding a new algorithm, make sure you:

- [ ] Create component in `/src/app/components/[Name]Visualizer.tsx`
- [ ] Export component as named export: `export function [Name]Visualizer() { ... }`
- [ ] Import component in `/src/app/App.tsx`
- [ ] Add to appropriate category in `algorithms` object
- [ ] Include speed control with the standard formula
- [ ] Add Play/Run and Reset buttons
- [ ] Use Motion for smooth animations
- [ ] Include algorithm explanation at the bottom
- [ ] Test at different speeds (1%, 50%, 100%)
- [ ] Use consistent color scheme

---

## 💡 Tips & Best Practices

1. **Keep it Simple**: Each visualizer should focus on one algorithm
2. **State Management**: Use React `useState` for local state
3. **Async/Await**: Use async functions for step-by-step execution
4. **Visual Feedback**: Always show what's happening (current element, comparing, sorted)
5. **Responsive**: Test on mobile and desktop
6. **Comments**: Add code comments explaining complex logic
7. **Disable Controls**: Disable buttons during execution to prevent issues
8. **Error Handling**: Add try-catch blocks for robust execution

---

## 📚 Common Algorithm Types & Patterns

### **Sorting Algorithms**
- Use bar heights for values
- Color code: comparing (yellow), sorted (green), default (indigo)
- Show swaps with animations

### **Search Algorithms**
- Highlight current search position
- Show found item in green, not found in red
- Display search path

### **Graph Algorithms**
- Use nodes and edges visualization
- Color visited nodes differently
- Show paths/distances

### **Data Structures**
- Animate push/pop/enqueue/dequeue operations
- Show structure state clearly
- Display values and pointers

### **Machine Learning**
- Show data points as scatter plots
- Animate training iterations
- Display metrics (accuracy, loss)

---

## 🎓 Need Help?

- Look at existing components (like `BubbleSortVisualizer.tsx`) for reference
- All components follow the same pattern
- Copy-paste-modify is a great starting point!
- UI components are in `/src/app/components/ui/`

---

**You're all set to extend the platform with unlimited algorithms!** 🎉
