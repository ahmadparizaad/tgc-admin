import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className = '', ...props }: SkeletonProps) => {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-muted/50 ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
