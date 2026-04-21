import React, { useState } from 'react';

interface TerminalInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onCommand?: (command: string) => void;
  className?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  placeholder = 'Type command...',
  value,
  onChange,
  onCommand,
  className = '',
  autoFocus = false,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Enter') {
      const command = inputValue.trim();
      if (command) {
        setHistory((prev) => [...prev, command]);
        setHistoryIndex(-1);
        setInputValue('');
        onCommand?.(command);
      }
    } else if (e.key === 'ArrowUp') {
      if (history.length === 0) return;
      const newIndex = Math.max(0, historyIndex + 1);
      setHistoryIndex(newIndex);
      setInputValue(history[history.length - newIndex]);
    } else if (e.key === 'ArrowDown') {
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(history[history.length - newIndex]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`cyberpunk-terminal relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-2 text-matrix-green bg-transparent border-none focus:outline-none"
        autoFocus={autoFocus}
        disabled={disabled}
      />
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-cyber-purple">
        $
      </div>
    </div>
  );
};

export default TerminalInput;