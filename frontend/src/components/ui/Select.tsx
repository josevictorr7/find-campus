import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (e: { target: { value: any; name?: string } }) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  name?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      error,
      helperText,
      placeholder,
      icon,
      disabled = false,
      name,
      className = '',
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const selectedOption = options.find((opt) => String(opt.value) === String(value));

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen]);

    const handleSelect = (optValue: string | number) => {
      if (onChange) {
        onChange({ target: { value: optValue, name } });
      }
      setIsOpen(false);
    };

    return (
      <div className="w-full flex flex-col gap-1.5" ref={ref}>
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative" ref={containerRef}>
          {/* Main Select Button Box */}
          <button
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`w-full flex items-center justify-between bg-white border ${
              error
                ? 'border-rose-400 focus:ring-rose-200'
                : isOpen
                ? 'border-brand-navy ring-4 ring-brand-navy/15 shadow-md'
                : 'border-slate-300 hover:border-slate-400 shadow-2xs hover:shadow-xs'
            } rounded-xl ${
              icon ? 'pl-10' : 'pl-3.5'
            } pr-10 py-2.5 text-sm transition-all duration-200 focus:outline-none cursor-pointer ${
              disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
            } ${className}`}
          >
            {/* Left Icon */}
            {icon && (
              <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
                {icon}
              </div>
            )}

            {/* Display Text */}
            <span
              className={`truncate text-left ${
                selectedOption ? 'text-slate-800 font-semibold' : 'text-slate-400'
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder || 'Selecione...'}
            </span>

            {/* Right Custom Animated Chevron */}
            <div
              className={`absolute right-3.5 text-slate-400 transition-transform duration-300 ${
                isOpen ? 'rotate-180 text-brand-navy' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4 stroke-[2.2]" />
            </div>
          </button>

          {/* Floating Dropdown Menu (Opened State) */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 bg-white rounded-2xl border border-slate-200/90 shadow-xl p-1.5 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
              {/* Optional Clear/Reset option if placeholder exists */}
              {placeholder && (
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    value === '' || value === undefined
                      ? 'bg-slate-100 font-bold text-slate-700'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                >
                  <span className="italic">{placeholder} (Todos)</span>
                  {(value === '' || value === undefined) && (
                    <Check className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </button>
              )}

              {/* Options List */}
              {options.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 flex items-center justify-between cursor-pointer my-0.5 ${
                      isSelected
                        ? 'bg-brand-navy text-white font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-brand-navy hover:font-medium'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-brand-yellow stroke-[2.5] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
