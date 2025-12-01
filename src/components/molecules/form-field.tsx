'use client';

import Input, { type InputProps } from '@/components/atoms/input';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
}

const FormField = ({ label, error, helperText, ...props }: FormFieldProps) => {
  return (
    <div className="space-y-1">
      <Input label={label} error={error} {...props} />
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;
