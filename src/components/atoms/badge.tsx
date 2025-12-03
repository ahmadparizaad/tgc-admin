import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
}

const Badge = ({ className = '', variant = 'default', children, ...props }: BadgeProps) => {
  const variants = {
    success: 'bg-success/15 text-success border border-success/20',
    warning: 'bg-warning/15 text-warning border border-warning/20',
    danger: 'bg-destructive/15 text-destructive border border-destructive/20',
    info: 'bg-info/15 text-info border border-info/20',
    default: 'bg-secondary text-secondary-foreground border border-border',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
