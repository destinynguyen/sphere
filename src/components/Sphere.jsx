import React, { useState } from 'react';
import { Calculator, Lightbulb, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Slider } from '../components/ui/slider';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Sphere = () => {
  const [radius, setRadius] = useState(5);
  const [calculatedRadius, setCalculatedRadius] = useState(null);
  const [calculation, setCalculation] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({ step1: '', step2: '', result: '' });
  const [inputStatus, setInputStatus] = useState({ step1: null, step2: null, result: null });
  const [stepCompleted, setStepCompleted] = useState({ step1: false, step2: false, result: false });
  const minRadius = 1;
  const maxRadius = 10;
  const scaleFactor = 25;

  const calculateSurfaceArea = () => {
    const step1 = 4 * Math.PI;
    const step2 = radius * radius;
    const result = step1 * step2;
    setCalculation({
      step1: step1.toFixed(4),
      step1Approx: (4 * 3.14).toFixed(4),
      step2: step2.toFixed(4),
      result: result.toFixed(4),
      resultApprox: (4 * 3.14 * step2).toFixed(4)
    });
    setCalculatedRadius(radius);
    setCurrentStepIndex(0);
    setUserInputs({ step1: '', step2: '', result: '' });
    setInputStatus({ step1: null, step2: null, result: null });
    setStepCompleted({ step1: false, step2: false, result: false });
  };

  const sphereSize = (radius - minRadius + 1) * scaleFactor;

  const renderSphere = () => (
    <svg width={sphereSize} height={sphereSize} viewBox={`0 0 ${sphereSize} ${sphereSize}`}>
      <circle
        cx={sphereSize / 2}
        cy={sphereSize / 2}
        r={sphereSize / 2 - 1}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2"
      />
      <path
        d={`M 0,${sphereSize / 2} C ${sphereSize / 10},${sphereSize / 3} ${9 * sphereSize / 10},${sphereSize / 3} ${sphereSize},${sphereSize / 2}`}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <path
        d={`M 0,${sphereSize / 2} C ${sphereSize / 10},${2 * sphereSize / 3} ${9 * sphereSize / 10},${2 * sphereSize / 3} ${sphereSize},${sphereSize / 2}`}
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2"
      />
      <circle
        cx={sphereSize / 2}
        cy={sphereSize / 2}
        r="3"
        fill="red"
      />
      <line
        x1={sphereSize / 2}
        y1={sphereSize / 2}
        x2={sphereSize}
        y2={sphereSize / 2}
        stroke="#0ea5e9"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
      <text
        x={3 * sphereSize / 4}
        y={sphereSize / 2 - 10}
        fill="#0ea5e9"
        fontSize="14"
        textAnchor="middle"
      >
        r
      </text>
    </svg>
  );

  const handleStepInputChange = (e, field) => {
    setUserInputs({ ...userInputs, [field]: e.target.value });
    setInputStatus({ ...inputStatus, [field]: null });
  };

  const checkStep = (field) => {
    let isCorrect = false;
    switch (field) {
      case 'step1':
        isCorrect = Math.abs(parseFloat(userInputs.step1) - parseFloat(calculation.step1)) < 0.01 ||
                    Math.abs(parseFloat(userInputs.step1) - parseFloat(calculation.step1Approx)) < 0.01;
        break;
      case 'step2':
        isCorrect = Math.abs(parseFloat(userInputs.step2) - parseFloat(calculation.step2)) < 0.01;
        break;
      case 'result':
        isCorrect = Math.abs(parseFloat(userInputs.result) - parseFloat(calculation.result)) < 0.01 ||
                    Math.abs(parseFloat(userInputs.result) - parseFloat(calculation.resultApprox)) < 0.01;
        break;
    }

    setInputStatus({ ...inputStatus, [field]: isCorrect ? 'correct' : 'incorrect' });
    if (isCorrect) {
      setStepCompleted({ ...stepCompleted, [field]: true });
      if (currentStepIndex < 2) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const skipStep = (field) => {
    setUserInputs({ ...userInputs, [field]: calculation[field] });
    setInputStatus({ ...inputStatus, [field]: 'correct' });
    setStepCompleted({ ...stepCompleted, [field]: true });
    if (currentStepIndex < 2) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const getInputClassName = (field) => {
    let baseClass = "text-xs px-1 text-left";
    switch (inputStatus[field]) {
      case 'correct':
        return `${baseClass} border-green-500 focus:border-green-500`;
      case 'incorrect':
        return `${baseClass} border-red-500 focus:border-red-500`;
      default:
        return `${baseClass} border-gray-300 focus:border-blue-500`;
    }
  };

  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      <Card className="w-full max-w-2xl mx-auto shadow-md bg-white">
        <CardHeader className="bg-sky-100 text-sky-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold">Sphere Surface Area Explorer</CardTitle>
            <Calculator size={40} className="text-sky-600" />
          </div>
          <CardDescription className="text-sky-700 text-lg">Discover How Sphere Surface Area Changes!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert className="bg-blue-50 border-blue-100">
            <Lightbulb className="h-4 w-4 text-blue-400" />
            <AlertTitle className="text-blue-700">What is Surface Area?</AlertTitle>
            <AlertDescription className="text-blue-600">
              Surface area is the total area of the outer layer of a three-dimensional object. For a sphere, it's calculated using the formula A = 4πr², where r is the radius. You can use π ≈ 3.14 for your calculations.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <label className="block text-lg font-medium text-gray-700">Adjust the sphere's radius:</label>
            <Slider
              min={minRadius}
              max={maxRadius}
              step={0.5}
              value={[radius]}
              onValueChange={(value) => setRadius(value[0])}
              className="w-full cursor-pointer"
            />
            <style jsx global>{`
              .slider-thumb {
                cursor: pointer;
              }
            `}</style>
            <div className="h-64 flex items-center justify-center overflow-hidden">
              {renderSphere()}
            </div>
            <div className="p-4 bg-purple-50 rounded">
              <p className="font-semibold text-purple-700">Current Radius:</p>
              <p className="ml-4 text-purple-600 text-2xl font-bold">{radius.toFixed(1)} units</p>
              {calculatedRadius !== null && calculatedRadius !== radius && (
                <p className="ml-4 text-amber-600 text-sm">
                  (Calculation shown for radius: {calculatedRadius.toFixed(1)} units)
                </p>
              )}
            </div>
            <Button onClick={calculateSurfaceArea} className="w-full">
              Calculate Surface Area
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start bg-gray-50">
          {calculation && (
            <div className="w-full space-y-2">
              <p className="font-semibold text-purple-600">Calculation Steps:</p>
              <div className="bg-purple-50 p-2 rounded">
                <p>Step 1: Calculate 4π (You can use π ≈ 3.14)</p>
                {stepCompleted.step1 ? (
                  <p className="text-green-600">= {calculation.step1} (or approximately {calculation.step1Approx})</p>
                ) : (
                  <div className="flex items-center space-x-1 text-sm mt-2">
                    <Input
                      type="number"
                      value={userInputs.step1}
                      onChange={(e) => handleStepInputChange(e, 'step1')}
                      placeholder="Enter Answer"
                      className={getInputClassName('step1')}
                      style={{ width: '120px' }}
                    />
                    <Button onClick={() => checkStep('step1')} className="bg-blue-400 hover:bg-blue-500 px-2 py-1 text-xs">
                      Check
                    </Button>
                    <Button onClick={() => skipStep('step1')} className="bg-gray-400 hover:bg-gray-500 px-2 py-1 text-xs">
                      Skip
                    </Button>
                    {inputStatus.step1 === 'correct' && <Check className="text-green-500 w-4 h-4" />}
                    {inputStatus.step1 === 'incorrect' && <X className="text-red-500 w-4 h-4" />}
                  </div>
                )}
              </div>
              {(currentStepIndex >= 1 || stepCompleted.step1) && (
                <div className="bg-purple-50 p-2 rounded">
                  <p>Step 2: Calculate r² (r = {calculatedRadius.toFixed(1)})</p>
                  {stepCompleted.step2 ? (
                    <p className="text-green-600">= {calculation.step2}</p>
                  ) : (
                    <div className="flex items-center space-x-1 text-sm mt-2">
                      <Input
                        type="number"
                        value={userInputs.step2}
                        onChange={(e) => handleStepInputChange(e, 'step2')}
                        placeholder="Enter Answer"
                        className={getInputClassName('step2')}
                        style={{ width: '120px' }}
                      />
                      <Button onClick={() => checkStep('step2')} className="bg-blue-400 hover:bg-blue-500 px-2 py-1 text-xs">
                        Check
                      </Button>
                      <Button onClick={() => skipStep('step2')} className="bg-gray-400 hover:bg-gray-500 px-2 py-1 text-xs">
                        Skip
                      </Button>
                      {inputStatus.step2 === 'correct' && <Check className="text-green-500 w-4 h-4" />}
                      {inputStatus.step2 === 'incorrect' && <X className="text-red-500 w-4 h-4" />}
                    </div>
                  )}
                </div>
              )}
              {(currentStepIndex >= 2 || (stepCompleted.step1 && stepCompleted.step2)) && (
                <div className="bg-purple-50 p-2 rounded">
                  <p>Step 3: Multiply the results from Step 1 and Step 2</p>
                  {stepCompleted.result ? (
                    <p className="text-green-600">
                      = {calculation.result} square units (exact)
                      <br />
                      ≈ {calculation.resultApprox} square units (using π ≈ 3.14)
                    </p>
                  ) : (
                    <div className="flex items-center space-x-1 text-sm mt-2">
                      <Input
                        type="number"
                        value={userInputs.result}
                        onChange={(e) => handleStepInputChange(e, 'result')}
                        placeholder="Enter Answer"
                        className={getInputClassName('result')}
                        style={{ width: '120px' }}
                      />
                      <Button onClick={() => checkStep('result')} className="bg-blue-400 hover:bg-blue-500 px-2 py-1 text-xs">
                        Check
                      </Button>
                      <Button onClick={() => skipStep('result')} className="bg-gray-400 hover:bg-gray-500 px-2 py-1 text-xs">
                        Skip
                      </Button>
                      {inputStatus.result === 'correct' && <Check className="text-green-500 w-4 h-4" />}
                      {inputStatus.result === 'incorrect' && <X className="text-red-500 w-4 h-4" />}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Sphere;