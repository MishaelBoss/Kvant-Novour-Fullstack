export function KvantumIDSkeleton() {
    return (
        <div className="min-h-screen bg-white font-sans text-[#2B2E33] animate-pulse">
            <header className="max-w-[1200px] mx-auto pt-8 px-4">
                <div className="mb-2">
                    <div className="h-8 w-32 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded mt-1" />
            </header>

            <main className="max-w-[1200px] mx-auto mt-12 px-4 flex gap-16">
                <aside className="w-64 flex-shrink-0">
                    <div className="h-5 w-24 bg-gray-200 rounded mb-10" />
                </aside>

                <section className="flex-1 max-w-[800px]">
                    <div className="flex items-start gap-8 mb-12">
                        <div className="w-[120px] h-[120px] rounded-full bg-gray-200" />
                        <div className="flex-1 pt-2">
                            <div className="h-9 w-64 bg-gray-200 rounded mb-6" />
                            <div className="flex gap-16">
                                <div className="space-y-2">
                                    <div className="h-3 w-12 bg-gray-200 rounded" />
                                    <div className="h-5 w-32 bg-gray-200 rounded" />
                                    <div className="h-4 w-16 bg-gray-200 rounded mt-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 w-12 bg-gray-200 rounded" />
                                    <div className="h-5 w-40 bg-gray-200 rounded" />
                                    <div className="h-4 w-16 bg-gray-200 rounded mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12">
                        <div className="h-px w-full bg-gray-200 mb-8" />
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-7 w-56 bg-gray-200 rounded" />
                                <div className="h-5 w-48 bg-gray-200 rounded" />
                                <div className="h-5 w-32 bg-gray-200 rounded mt-4" />
                            </div>
                            <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};