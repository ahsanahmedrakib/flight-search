const LoadingSkeleton = () => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-full bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex-1 space-y-4 w-full">
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded-full w-24" />
              <div className="h-5 bg-gray-200 rounded-full w-16" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div className="h-8 bg-gray-200 rounded-xl" />
              <div className="h-8 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded-xl" />
              <div className="h-8 bg-gray-200 rounded-xl" />
            </div>
          </div>
          <div className="w-full md:w-48 h-24 bg-gray-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
