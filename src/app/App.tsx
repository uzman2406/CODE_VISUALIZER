import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { BubbleSortVisualizer } from './components/BubbleSortVisualizer';
import { BinarySearchVisualizer } from './components/BinarySearchVisualizer';
import { LinearSearchVisualizer } from './components/LinearSearchVisualizer';
import { QuickSortVisualizer } from './components/QuickSortVisualizer';
import { MergeSortVisualizer } from './components/MergeSortVisualizer';
import { HeapSortVisualizer } from './components/HeapSortVisualizer';
import { StackVisualizer } from './components/StackVisualizer';
import { QueueVisualizer } from './components/QueueVisualizer';
import { LinkedListVisualizer } from './components/LinkedListVisualizer';
import { BinaryTreeVisualizer } from './components/BinaryTreeVisualizer';
import { GraphDFSVisualizer } from './components/GraphDFSVisualizer';
import { GraphBFSVisualizer } from './components/GraphBFSVisualizer';
import { DijkstraVisualizer } from './components/DijkstraVisualizer';
import { KnapsackVisualizer } from './components/KnapsackVisualizer';
import { NQueensVisualizer } from './components/NQueensVisualizer';
import { KNNVisualizer } from './components/KNNVisualizer';
import { LinearRegressionVisualizer } from './components/LinearRegressionVisualizer';
import { DecisionTreeVisualizer } from './components/DecisionTreeVisualizer';
import { CodeEditorVisualizer } from './components/CodeEditorVisualizer';
import { 
  Code2, Layers, Search, GitBranch, List, ArrowRightLeft, Link2, Binary, 
  Network, Zap, Brain, Box, TrendingUp 
} from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('codeeditor');

  const categories = [
    { id: 'codeeditor', label: 'Code Editor', icon: Code2 },
    { id: 'sorting', label: 'Sorting', icon: ArrowRightLeft },
    { id: 'searching', label: 'Searching', icon: Search },
    { id: 'graphs', label: 'Graphs', icon: Network },
    { id: 'greedy', label: 'Greedy & DP', icon: Zap },
    { id: 'backtracking', label: 'Backtracking', icon: GitBranch },
    { id: 'datastructures', label: 'Data Structures', icon: Layers },
    { id: 'ml', label: 'Machine Learning', icon: Brain },
  ];

  const algorithms = {
    codeeditor: [
      {
        id: 'codeeditor',
        name: 'Interactive Code Editor',
        description: 'Write code and watch it execute step-by-step with variable tracking',
        component: CodeEditorVisualizer,
        icon: Code2,
      },
    ],
    sorting: [
      {
        id: 'bubble',
        name: 'Bubble Sort',
        description: 'O(n²) - Repeatedly swaps adjacent elements if in wrong order',
        component: BubbleSortVisualizer,
        icon: ArrowRightLeft,
      },
      {
        id: 'quick',
        name: 'Quick Sort',
        description: 'O(n log n) avg - Divide-and-conquer using pivot partitioning',
        component: QuickSortVisualizer,
        icon: GitBranch,
      },
      {
        id: 'merge',
        name: 'Merge Sort',
        description: 'O(n log n) - Recursively divide array and merge sorted halves',
        component: MergeSortVisualizer,
        icon: GitBranch,
      },
      {
        id: 'heap',
        name: 'Heap Sort',
        description: 'O(n log n) - Build max heap and extract elements',
        component: HeapSortVisualizer,
        icon: Box,
      },
    ],
    searching: [
      {
        id: 'linear',
        name: 'Linear Search',
        description: 'O(n) - Sequential search through each element',
        component: LinearSearchVisualizer,
        icon: Search,
      },
      {
        id: 'binary',
        name: 'Binary Search',
        description: 'O(log n) - Divide and conquer in sorted arrays',
        component: BinarySearchVisualizer,
        icon: Binary,
      },
    ],
    graphs: [
      {
        id: 'dfs',
        name: 'Depth-First Search (DFS)',
        description: 'O(V+E) - Graph traversal using stack/recursion',
        component: GraphDFSVisualizer,
        icon: Network,
      },
      {
        id: 'bfs',
        name: 'Breadth-First Search (BFS)',
        description: 'O(V+E) - Level-order traversal using queue',
        component: GraphBFSVisualizer,
        icon: Network,
      },
    ],
    greedy: [
      {
        id: 'dijkstra',
        name: "Dijkstra's Algorithm",
        description: 'O((V+E) log V) - Shortest path using greedy approach',
        component: DijkstraVisualizer,
        icon: Network,
      },
      {
        id: 'knapsack',
        name: '0/1 Knapsack (DP)',
        description: 'O(nW) - Dynamic programming for optimal selection',
        component: KnapsackVisualizer,
        icon: Box,
      },
    ],
    backtracking: [
      {
        id: 'nqueens',
        name: 'N-Queens Problem',
        description: 'O(N!) - Backtracking to place N queens on chessboard',
        component: NQueensVisualizer,
        icon: GitBranch,
      },
    ],
    datastructures: [
      {
        id: 'stack',
        name: 'Stack (LIFO)',
        description: 'Last In First Out - Push, Pop, Peek operations',
        component: StackVisualizer,
        icon: List,
      },
      {
        id: 'queue',
        name: 'Queue (FIFO)',
        description: 'First In First Out - Enqueue, Dequeue operations',
        component: QueueVisualizer,
        icon: List,
      },
      {
        id: 'linkedlist',
        name: 'Linked List',
        description: 'Linear collection with node pointers',
        component: LinkedListVisualizer,
        icon: Link2,
      },
      {
        id: 'binarytree',
        name: 'Binary Search Tree',
        description: 'Hierarchical structure with BST property',
        component: BinaryTreeVisualizer,
        icon: GitBranch,
      },
    ],
    ml: [
      {
        id: 'knn',
        name: 'K-Nearest Neighbors',
        description: 'Instance-based learning - Classification by majority vote',
        component: KNNVisualizer,
        icon: Brain,
      },
      {
        id: 'linearreg',
        name: 'Linear Regression',
        description: 'Supervised learning - Gradient descent optimization',
        component: LinearRegressionVisualizer,
        icon: TrendingUp,
      },
      {
        id: 'decisiontree',
        name: 'Decision Tree',
        description: 'Tree-based model using information gain splits',
        component: DecisionTreeVisualizer,
        icon: GitBranch,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Code2 className="w-10 h-10 md:w-12 md:h-12 text-indigo-600" />
            <h1 className="text-indigo-900">Complete Algorithm Visualizer</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Interactive visualizations of DSA, Algorithms & Machine Learning - Watch code execute step-by-step!
          </p>
        </div>

        {/* Category Selection */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 mb-6 h-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <TabsTrigger key={cat.id} value={cat.id} className="gap-1 text-xs md:text-sm py-2">
                  <Icon className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Algorithm Cards */}
          {Object.keys(algorithms).map((categoryId) => (
            <TabsContent key={categoryId} value={categoryId}>
              <div className={`grid gap-4 md:gap-6 ${categoryId === 'codeeditor' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                {algorithms[categoryId as keyof typeof algorithms].map((algo) => {
                  const AlgoComponent = algo.component;
                  const Icon = algo.icon;
                  return (
                    <Card key={algo.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                          <div>
                            <CardTitle className="text-base md:text-lg">{algo.name}</CardTitle>
                            <CardDescription className="text-indigo-100 text-xs md:text-sm">
                              {algo.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 md:p-6">
                        <AlgoComponent />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-white/50 rounded-lg text-center text-sm text-gray-600">
          <strong>Available Algorithms:</strong> {Object.values(algorithms).flat().length} visualizers covering
          Sorting, Searching, Graph Algorithms, Dynamic Programming, Greedy Methods, Backtracking, Data Structures & Machine Learning
        </div>
      </div>
    </div>
  );
}
