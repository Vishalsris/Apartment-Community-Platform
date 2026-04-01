import { forwardRef } from 'react';
import { cn } from './Button';

const Input = forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-textMain mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
