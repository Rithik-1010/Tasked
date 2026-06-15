const Skeleton = ({ className = '', variant = 'rect' }) => {
  const base = 'animate-shimmer rounded';
  const variants = {
    rect: `${base} ${className}`,
    circle: `${base} rounded-full ${className}`,
    text: `${base} h-4 ${className}`
  };

  return <div className={variants[variant]} />;
};

export const TaskCardSkeleton = () => (
  <div className="glass rounded-2xl p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-5 h-5 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);

export const StatsCardSkeleton = () => (
  <div className="glass rounded-2xl p-5 space-y-3">
    <Skeleton className="w-10 h-10 rounded-xl" />
    <Skeleton className="h-8 w-20" />
    <Skeleton className="h-4 w-24" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <Skeleton className="h-5 w-32" />
    <Skeleton className="h-48 w-full rounded-xl" />
  </div>
);

export default Skeleton;
