import { useState } from 'react';

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performCalculation = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return firstValue / secondValue;
      default: return secondValue;
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (memory === null) {
      setMemory(inputValue);
    } else if (operation) {
      const currentValue = memory || 0;
      const newValue = performCalculation(currentValue, inputValue, operation);
      setMemory(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const equals = () => {
    if (!operation || memory === null) return;

    const inputValue = parseFloat(display);
    const newValue = performCalculation(memory, inputValue, operation);
    setDisplay(String(newValue));
    setMemory(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  // Draggable calculator handlers
  const handleMouseDown = (e) => {
    if (!expanded) return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    display,
    expanded,
    position,
    isDragging,
    inputDigit,
    inputDecimal,
    clear,
    performOperation,
    equals,
    setExpanded,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}; 