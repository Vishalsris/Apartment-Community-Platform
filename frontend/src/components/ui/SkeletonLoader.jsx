import { cn } from './Button';

const SkeletonLoader = ({ className, type = 'text', count = 1 }) => {
  const types = {
    text: 'h-4 w-3/4 rounded bg-gray-200',
    title: 'h-6 w-1/2 rounded bg-gray-200 block mb-4',
    avatar: 'h-12 w-12 rounded-full bg-gray-200',
    card: 'h-40 w-full rounded-2xl bg-gray-200'
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('animate-pulse', types[type], className)} />
      ))}
    </>
  );
};

export default SkeletonLoader;
