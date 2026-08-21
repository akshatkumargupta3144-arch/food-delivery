const LoadingSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="skeleton h-40"></div>
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-3 w-full"></div>
            <div className="skeleton h-3 w-2/3"></div>
            <div className="skeleton h-10 w-full"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSkeleton
