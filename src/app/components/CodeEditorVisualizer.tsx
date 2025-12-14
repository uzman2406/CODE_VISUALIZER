import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Play, RotateCcw, Code2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Variable {
  name: string;
  value: any;
  type: string;
}

export function CodeEditorVisualizer() {
  const [code, setCode] = useState(`// Example: Array Operations
let arr = [5, 2, 8, 1, 9];
let sum = 0;

for (let i = 0; i < arr.length; i++) {
  sum = sum + arr[i];
}

let average = sum / arr.length;`);

  const [running, setRunning] = useState(false);
  const [currentLine, setCurrentLine] = useState(-1);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [output, setOutput] = useState<string[]>([]);
  const [speed, setSpeed] = useState([30]);
  const [arrayViz, setArrayViz] = useState<any[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const updateVariable = (varList: Variable[], name: string, value: any, vars: any) => {
    const varIndex = varList.findIndex((v) => v.name === name);
    const type = Array.isArray(value) ? 'array' : typeof value;
    
    if (varIndex >= 0) {
      varList[varIndex].value = value;
      varList[varIndex].type = type;
    } else {
      varList.push({ name, value, type });
    }
    
    // Update array visualization if it's an array variable
    if (Array.isArray(value)) {
      setArrayViz(value.map((v: any, i: number) => ({ value: v, index: i })));
    }
  };

  const evaluateExpression = (expr: string, vars: any): any => {
    try {
      // Clean up the expression
      expr = expr.trim();
      
      // Remove inline comments
      if (expr.includes('//')) {
        expr = expr.split('//')[0].trim();
      }
      
      // Remove semicolons
      expr = expr.replace(/;$/, '').trim();
      
      // First, try to evaluate the entire expression using Function
      // This handles complex cases like "arr.length - 1", "arr[i] + 1", etc.
      const varNames = Object.keys(vars);
      const varValues = Object.values(vars);
      
      return Function(...varNames, `return ${expr}`)(...varValues);
    } catch (e) {
      throw new Error(`Cannot evaluate "${expr}". Make sure all variables are defined and using JavaScript syntax.`);
    }
  };

  const validateCode = (code: string): { valid: boolean; error?: string } => {
    // Check for Python-specific syntax
    if (code.includes('self.') || code.includes('def ') || code.includes('class ')) {
      return { valid: false, error: 'Python syntax detected. Please use JavaScript syntax only.' };
    }
    if (code.includes('True') || code.includes('False') || code.includes('None')) {
      return { valid: false, error: 'Python keywords detected. Use JavaScript: true, false, null' };
    }
    if (code.match(/print\s*\(/)) {
      return { valid: false, error: 'Use JavaScript syntax. Replace print() with console.log() or variables' };
    }
    if (code.includes('range(')) {
      return { valid: false, error: 'Python range() not supported. Use: for (let i = 0; i < n; i++)' };
    }
    
    return { valid: true };
  };

  const parseAndExecute = async () => {
    // Validate code first
    const validation = validateCode(code);
    if (!validation.valid) {
      setOutput([`✗ Syntax Error: ${validation.error}`]);
      setLogs([`✗ ${validation.error}`]);
      return;
    }

    setRunning(true);
    setCurrentLine(-1);
    setVariables([]);
    setOutput([]);
    setArrayViz([]);
    setHighlightIndex(-1);
    setLogs(['Starting execution...']);

    const lines = code.split('\n');
    const vars: any = {};
    const varList: Variable[] = [];

    try {
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trim();
        
        // Skip empty lines and comments
        if (!line || line.startsWith('//')) {
          i++;
          continue;
        }

        setCurrentLine(i);
        setLogs(prev => [...prev, `Line ${i + 1}: ${line}`]);
        await sleep(2000 - speed[0] * 18);

        // Variable declaration: let varName = value;
        if (line.match(/^let\s+(\w+)\s*=\s*(.+);?$/)) {
          const match = line.match(/^let\s+(\w+)\s*=\s*(.+);?$/);
          if (match) {
            const varName = match[1];
            let valueExpr = match[2].replace(/;$/, '').trim();

            // Handle array literal
            if (valueExpr.startsWith('[') && valueExpr.endsWith(']')) {
              const arrValue = JSON.parse(valueExpr);
              vars[varName] = arrValue;
              updateVariable(varList, varName, arrValue, vars);
            } 
            // Handle number literal
            else if (!isNaN(Number(valueExpr))) {
              vars[varName] = Number(valueExpr);
              updateVariable(varList, varName, Number(valueExpr), vars);
            }
            // Handle expression
            else {
              const result = evaluateExpression(valueExpr, vars);
              vars[varName] = result;
              updateVariable(varList, varName, result, vars);
            }

            setVariables([...varList]);
          }
          i++;
        }
        // For loop: for (let i = start; i < end; i++)
        else if (line.match(/^for\s*\(/)) {
          const forMatch = line.match(/^for\s*\(\s*let\s+(\w+)\s*=\s*(.+?);\s*(\w+)\s*([<>=!]+)\s*(.+?);\s*(\w+)\s*(\+\+|--|\+=\s*\d+)\s*\)/);
          
          if (forMatch) {
            const loopVar = forMatch[1];
            const startExpr = forMatch[2].trim();
            const condVar = forMatch[3];
            const operator = forMatch[4];
            const endExpr = forMatch[5].trim();
            const increment = forMatch[7];

            // Evaluate start and end
            const startVal = evaluateExpression(startExpr, vars);
            
            // Find loop body (between { and })
            let braceCount = 0;
            let loopStart = i;
            let loopEnd = i;
            
            for (let j = i; j < lines.length; j++) {
              const l = lines[j];
              braceCount += (l.match(/{/g) || []).length;
              braceCount -= (l.match(/}/g) || []).length;
              
              if (braceCount === 0 && l.includes('}')) {
                loopEnd = j;
                break;
              }
            }

            // Extract loop body
            const bodyStart = lines[loopStart].indexOf('{') !== -1 ? loopStart : loopStart + 1;
            const bodyLines = lines.slice(bodyStart + (lines[loopStart].indexOf('{') !== -1 ? 0 : 1), loopEnd)
              .map(l => l.trim())
              .filter(l => l && l !== '{' && l !== '}');

            // Execute loop
            for (let loopVal = startVal; ; loopVal++) {
              vars[loopVar] = loopVal;
              updateVariable(varList, loopVar, loopVal, vars);
              setVariables([...varList]);
              setHighlightIndex(loopVal);
              await sleep(2000 - speed[0] * 18);

              // Check condition
              const endVal = evaluateExpression(endExpr, vars);
              let continueLoop = false;
              
              if (operator === '<') continueLoop = loopVal < endVal;
              else if (operator === '<=') continueLoop = loopVal <= endVal;
              else if (operator === '>') continueLoop = loopVal > endVal;
              else if (operator === '>=') continueLoop = loopVal >= endVal;
              else if (operator === '!=') continueLoop = loopVal != endVal;
              
              if (!continueLoop) break;

              // Execute loop body
              for (const bodyLine of bodyLines) {
                if (!bodyLine || bodyLine.startsWith('//')) continue;

                setLogs(prev => [...prev, `  Body: ${bodyLine}`]);
                await sleep(2000 - speed[0] * 18);

                // Assignment: varName = expression;
                if (bodyLine.match(/^(\w+)\s*=\s*(.+);?$/)) {
                  const assignMatch = bodyLine.match(/^(\w+)\s*=\s*(.+);?$/);
                  if (assignMatch) {
                    const varName = assignMatch[1];
                    const expr = assignMatch[2].replace(/;$/, '').trim();
                    
                    const result = evaluateExpression(expr, vars);
                    vars[varName] = result;
                    updateVariable(varList, varName, result, vars);
                    setVariables([...varList]);
                    await sleep(2000 - speed[0] * 18);
                  }
                }
                // if statement
                else if (bodyLine.match(/^if\s*\(/)) {
                  const ifMatch = bodyLine.match(/^if\s*\((.+)\)\s*{?$/);
                  if (ifMatch) {
                    const condition = ifMatch[1].trim();
                    const condResult = evaluateExpression(condition, vars);
                    
                    if (condResult) {
                      // Find the statement after if
                      const nextLineIdx = bodyLines.indexOf(bodyLine) + 1;
                      if (nextLineIdx < bodyLines.length) {
                        const ifBody = bodyLines[nextLineIdx].trim();
                        
                        if (ifBody.match(/^(\w+)\s*=\s*(.+);?$/)) {
                          const assignMatch = ifBody.match(/^(\w+)\s*=\s*(.+);?$/);
                          if (assignMatch) {
                            const varName = assignMatch[1];
                            const expr = assignMatch[2].replace(/;$/, '').trim();
                            
                            const result = evaluateExpression(expr, vars);
                            vars[varName] = result;
                            updateVariable(varList, varName, result, vars);
                            setVariables([...varList]);
                            await sleep(2000 - speed[0] * 18);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            i = loopEnd + 1;
            setHighlightIndex(-1);
          } else {
            i++;
          }
        }
        // Assignment: varName = expression;
        else if (line.match(/^(\w+)\s*=\s*(.+);?$/) && !line.startsWith('let')) {
          const match = line.match(/^(\w+)\s*=\s*(.+);?$/);
          if (match) {
            const varName = match[1];
            const expr = match[2].replace(/;$/, '').trim();
            
            const result = evaluateExpression(expr, vars);
            vars[varName] = result;
            updateVariable(varList, varName, result, vars);
            setVariables([...varList]);
          }
          i++;
        }
        else {
          i++;
        }
      }

      setOutput(['✓ Execution completed successfully']);
      setLogs(prev => [...prev, '✓ Execution completed!']);
    } catch (error) {
      const errMsg = '✗ Error: ' + (error as Error).message;
      setOutput([errMsg]);
      setLogs(prev => [...prev, errMsg]);
      console.error('Execution error:', error);
    }

    setCurrentLine(-1);
    setHighlightIndex(-1);
    setRunning(false);
  };

  const reset = () => {
    setCurrentLine(-1);
    setVariables([]);
    setOutput([]);
    setArrayViz([]);
    setHighlightIndex(-1);
    setLogs([]);
  };

  const loadExample = (example: string) => {
    const examples: { [key: string]: string } = {
      array: `// Array Sum Example
let arr = [5, 2, 8, 1, 9];
let sum = 0;

for (let i = 0; i < arr.length; i++) {
  sum = sum + arr[i];
}

let average = sum / arr.length;`,
      
      fibonacci: `// Fibonacci Sequence
let a = 0;
let b = 1;
let n = 8;

for (let i = 0; i < n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

let result = a;`,

      factorial: `// Factorial Calculation
let n = 5;
let factorial = 1;

for (let i = 1; i <= n; i++) {
  factorial = factorial * i;
}`,

      max: `// Find Maximum
let numbers = [3, 7, 2, 9, 1, 5];
let max = numbers[0];

for (let i = 1; i < numbers.length; i++) {
  let current = numbers[i];
  if (current > max) {
    max = current;
  }
}`,
    };

    setCode(examples[example] || examples.array);
    reset();
  };

  const codeLines = code.split('\n');

  return (
    <div className="space-y-4">
      {/* Code Examples */}
      <Tabs defaultValue="custom" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="array" onClick={() => loadExample('array')}>Array Sum</TabsTrigger>
          <TabsTrigger value="fibonacci" onClick={() => loadExample('fibonacci')}>Fibonacci</TabsTrigger>
          <TabsTrigger value="factorial" onClick={() => loadExample('factorial')}>Factorial</TabsTrigger>
          <TabsTrigger value="max" onClick={() => loadExample('max')}>Find Max</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Code2 className="w-4 h-4" />
            <span>Code Editor</span>
          </div>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            {/* Line numbers and code */}
            <div className="flex">
              {/* Line numbers */}
              <div className="bg-gray-800 text-gray-500 text-right py-3 px-2 select-none font-mono text-sm">
                {codeLines.map((_, idx) => (
                  <div
                    key={idx}
                    className={`leading-6 ${currentLine === idx ? 'text-yellow-400 font-bold' : ''}`}
                  >
                    {idx + 1}
                  </div>
                ))}
              </div>
              
              {/* Code area */}
              <div className="flex-1 relative">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={running}
                  className="font-mono text-sm h-80 resize-none bg-gray-900 text-green-400 border-0 focus:ring-0 leading-6"
                  placeholder="Write your code here..."
                  style={{ paddingTop: '12px' }}
                />
                
                {/* Current line highlight */}
                {currentLine >= 0 && (
                  <div
                    className="absolute left-0 right-0 bg-yellow-500 opacity-20 pointer-events-none"
                    style={{
                      top: `${currentLine * 24 + 12}px`,
                      height: '24px',
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Visualization Area */}
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Visual Output</div>
          <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
            {/* Array Visualization */}
            {arrayViz.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-2">Array Visualization:</div>
                <div className="flex gap-2 flex-wrap">
                  {arrayViz.map((item, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: highlightIndex === idx ? 1.2 : 1,
                        backgroundColor: highlightIndex === idx ? '#F59E0B' : '#6366F1',
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-14 h-14 rounded-lg flex flex-col items-center justify-center text-white shadow-md"
                    >
                      <div className="text-xs opacity-75">[{idx}]</div>
                      <div className="font-bold">{item.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Variables */}
            {variables.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-2">Variables:</div>
                <AnimatePresence mode="popLayout">
                  {variables.map((variable) => (
                    <motion.div
                      key={variable.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2 mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                    >
                      <span className="text-purple-600 font-mono font-bold">{variable.name}</span>
                      <span className="text-gray-400">=</span>
                      <span className="text-indigo-600 font-mono">
                        {Array.isArray(variable.value)
                          ? `[${variable.value.join(', ')}]`
                          : String(variable.value)}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto px-2 py-1 bg-gray-100 rounded">
                        {variable.type}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Output */}
            {output.length > 0 && (
              <div className="mb-4">
                <div className="text-xs text-gray-600 mb-2">Status:</div>
                {output.map((line, idx) => (
                  <div
                    key={idx}
                    className={`text-sm font-semibold p-2 rounded ${
                      line.startsWith('✓')
                        ? 'text-green-600 bg-green-50'
                        : 'text-red-600 bg-red-50'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}

            {/* Execution Log */}
            {logs.length > 0 && (
              <div>
                <div className="text-xs text-gray-600 mb-2">Execution Log:</div>
                <div className="bg-gray-900 text-green-400 font-mono text-xs p-2 rounded max-h-32 overflow-y-auto">
                  {logs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Execution Speed:</span>
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
        <Button onClick={parseAndExecute} disabled={running} className="gap-2">
          <Play className="w-4 h-4" />
          {running ? 'Running...' : 'Run Code'}
        </Button>
        <Button onClick={reset} disabled={running} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <strong>✨ Supported Features:</strong> Variable declarations (let), arrays, array access (arr[i]), 
        for loops, if statements, arithmetic operations, comparisons. 
        Watch variables and arrays update in real-time as your code executes step by step!
      </div>

      {/* Warning about syntax */}
      <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
        <strong>⚠️ JavaScript Only:</strong> This editor supports JavaScript syntax. 
        Python code (self, def, class, True/False, print, range) will not work. 
        Use JavaScript equivalents: functions, true/false, console.log, for loops.
      </div>
    </div>
  );
}