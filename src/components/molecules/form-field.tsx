'use client';

import Input, { type InputProps } from '@/components/atoms/input';

export interface FormFieldProps extends InputProps {
  label: string;
  error?: string;
  helperText?: string;
  children?: React.ReactNode;
}

const FormField = ({ label, error, helperText, children, ...props }: FormFieldProps) => {
  return (
    <div className="space-y-1">
      {children ? (
        <>
          {label && (
            <label className="block text-sm font-medium text-foreground mb-1.5">
              {label}
            </label>
          )}
          {children}
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </>
      ) : (
        <Input label={label} error={error} {...props} />
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;
