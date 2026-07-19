export function CartNewsSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full animate-pulse">
            <div className="h-48 relative overflow-hidden bg-gray-200" />
            <div className="p-6 flex flex-col flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>

                <div className="mt-auto pt-4">
                    <div className="h-11 bg-gray-200 rounded-xl w-full" />
                </div>
            </div>
        </div>
    );
}