const SidebarSkeleton = () => (
    <aside className="w-64 bg-white rounded-2xl p-4 shadow-sm h-fit animate-pulse">
        <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-[80px] h-[80px] rounded-full bg-gray-200" />
            <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-24 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
        </div>
        <nav className="flex flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2 mx-3" />
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 bg-gray-200 rounded-lg mx-1 mb-1" />
            ))}
        </nav>
    </aside>
);

const ContentSkeleton = () => (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-24 bg-gray-200 rounded" />
        </div>
    </div>
);

export const ProfileSkeleton = () => (
    <div className="min-h-screen bg-[#f4f5f7] p-4 md:p-8">
        <div className="max-w-[1416px] mx-auto flex flex-col md:flex-row gap-8">
            <SidebarSkeleton />
            <ContentSkeleton />
        </div>
    </div>
);