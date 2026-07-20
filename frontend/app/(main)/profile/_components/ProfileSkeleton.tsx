const SidebarSkeleton = () => (
    <aside className="w80 bg-white rounded-2xl p-4 shadow-sm h-fit animate-pulse">
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

export const PublicProfileSkeleton = () => (
    <div className="min-h-screen bg-white font-sans text-[#2B2E33]">
        <header className="max-w-300 mx-auto pt-8 px-4">
            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
        </header>

        <main className="max-w-300 mx-auto mt-6 px-4 pb-16">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse shrink-0" />
                    <div className="flex-1 pt-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-40 h-8 bg-gray-200 rounded animate-pulse" />
                            <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                        </div>
                        <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div className="w-32 h-7 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
                    <div className="w-60 h-60 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex flex-col gap-1">
                        <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
                        <div className="w-96 h-5 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </main>
    </div>
);