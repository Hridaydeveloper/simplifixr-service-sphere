import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  category?: string;
}

interface SmartSearchSelectProps {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  allowCustom?: boolean;
  customLabel?: string;
  onCustomValueChange?: (value: string) => void;
  className?: string;
}

export function SmartSearchSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  allowCustom = false,
  customLabel = "Other (Custom)",
  onCustomValueChange,
  className
}: SmartSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.category && option.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  const allDisplayOptions = React.useMemo(() => {
    const hasResults = filteredOptions.length > 0;
    if (allowCustom) {
      return hasResults 
        ? [...filteredOptions, { value: 'custom', label: customLabel }]
        : [{ value: 'custom', label: customLabel }];
    }
    return filteredOptions;
  }, [filteredOptions, allowCustom, customLabel]);

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = isCustomMode && customValue ? customValue : (selectedOption?.label || '');

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        // Don't clear custom mode and value on outside click, just close the dropdown
        if (!isCustomMode) {
          setIsCustomMode(false);
          setCustomValue('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCustomMode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allDisplayOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : allDisplayOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < allDisplayOptions.length) {
          handleSelectOption(allDisplayOptions[highlightedIndex]);
        }
        break;
    }
  };

  const handleSelectOption = (option: Option) => {
    if (option.value === 'custom') {
      setIsCustomMode(true);
      setIsOpen(false);
      setSearchTerm('');
      // Clear the regular value when switching to custom mode
      onValueChange('');
    } else {
      setIsCustomMode(false);
      setCustomValue(''); // Clear custom value when selecting from options
      onValueChange(option.value);
      setIsOpen(false);
      setSearchTerm('');
    }
    setHighlightedIndex(-1);
  };

  const handleCustomValueSubmit = () => {
    if (customValue.trim()) {
      onCustomValueChange?.(customValue.trim());
      setIsCustomMode(false); // Keep custom mode but close the input
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "text-left shadow-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isOpen && "ring-2 ring-ring ring-offset-2"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={cn(
          "block truncate",
          !displayValue && "text-muted-foreground"
        )}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className={cn(
          "absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg",
          "animate-in slide-in-from-top-2 fade-in-0"
        )}>
          {/* Search Input */}
          <div className="relative border-b p-2">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className={cn(
                "w-full rounded-md border-0 bg-transparent pl-10 pr-4 py-2 text-sm",
                "focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
              )}
            />
          </div>

          {/* Options List */}
          <div 
            ref={optionsRef}
            className="max-h-60 overflow-y-auto p-1"
            role="listbox"
          >
            {allDisplayOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              allDisplayOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm",
                    "transition-colors hover:bg-accent hover:text-accent-foreground",
                    highlightedIndex === index && "bg-accent text-accent-foreground",
                    value === option.value && option.value !== 'custom' && "bg-primary/10 text-primary"
                  )}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.value === 'custom' ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded border border-primary bg-primary/10 flex items-center justify-center">
                        <span className="text-xs text-primary">+</span>
                      </div>
                      <span className="font-medium text-primary">{option.label}</span>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1">{option.label}</span>
                      {option.category && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {option.category}
                        </span>
                      )}
                      {value === option.value && (
                        <Check className="h-4 w-4 text-primary ml-2" />
                      )}
                    </>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Custom Input Modal */}
      {isCustomMode && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg p-4 animate-in slide-in-from-top-2 fade-in-0">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">
                Enter Custom Service Name
              </label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCustomValueSubmit();
                  } else if (e.key === 'Escape') {
                    setIsCustomMode(false);
                    setCustomValue('');
                  }
                }}
                placeholder="e.g., Mobile Repair, Pet Sitting..."
                className={cn(
                  "mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleCustomValueSubmit}
                disabled={!customValue.trim()}
                className={cn(
                  "flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground",
                  "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                Add Service
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomValue('');
                }}
                className={cn(
                  "rounded-md border border-input px-3 py-2 text-sm font-medium",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}