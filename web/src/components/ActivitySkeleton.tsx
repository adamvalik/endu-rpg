export function ActivitySkeleton() {
  return (
    <div className="card mb-3 animate-pulse">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="h-5 bg-gray-300 w-3/4 mb-2 rounded" />
          <div className="h-3 bg-gray-300 w-1/2 mb-4 rounded" />

          <div className="flex justify-between w-3/5 mb-3 pb-3 border-b">
            <div>
              <div className="h-3 bg-gray-300 w-16 mb-1 rounded" />
              <div className="h-4 bg-gray-300 w-12 rounded" />
            </div>
            <div>
              <div className="h-3 bg-gray-300 w-16 mb-1 rounded" />
              <div className="h-4 bg-gray-300 w-12 rounded" />
            </div>
          </div>

          <div className="h-7 bg-gray-300 w-20 rounded" />
        </div>

        <div className="w-2/5 border-l-2 border-border">
          <div className="w-full h-48 bg-gray-100" />
        </div>
      </div>
    </div>
  )
}
