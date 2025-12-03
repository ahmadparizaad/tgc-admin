'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-3xl shadow-sm transition-colors
            bg-input text-foreground placeholder:text-muted-foreground
            border border-border
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-input
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-destructive focus:ring-destructive' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive animate-slide-up">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
