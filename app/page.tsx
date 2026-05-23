import Link from "next/link";

const tools = [
    {
        name: "Images to PDF Converter & PDF Merger",
        description: "Convert images & text file to PDF in seconds. Merge Multiple PDF into Single PDF.",
        icon: "📄",
        href: "/image-to-pdf",
        status: "Active",
        color: "from-rose-500 to-red-500",
    },
    {
        name: "Background Remover",
        description: "Remove background from images automatically using local AI.",
        icon: "✨",
        href: "/background-remover",
        status: "Active",
        color: "from-purple-500 to-pink-500",
    },
    {
        name: "Image Type Converter",
        description: "Convert images between JPG and PNG instantly.",
        icon: "📸",
        href: "/image-converter",
        status: "Active",
        color: "from-blue-500 to-indigo-500",
    }, {
        name: "Image Size Reducer",
        description: "Reduce image file size without losing premium quality.",
        icon: "📉",
        href: "/image-compressor",
        status: "Active",
        color: "from-emerald-500 to-teal-500",
    },
    {
        name: "Time Zone Converter",
        description: "Compare and convert times between different world time zones.",
        icon: "⏰",
        href: "/time-zone-converter",
        status: "Active",
        color: "from-amber-500 to-orange-500",
    }

];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-4 sm:p-8 md:p-12">
            {/* Background Decorative Circles */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <header className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Free And Secured Tools
                    </h1>
                    <p className="text-sm sm:text-base text-gray-100 mt-3 max-w-xl mx-auto">
                        A free and powerful set of high-utility tools designed to help you work smarter. This easy-to-use suite streamlines your everyday tasks and improves your speed and efficiency.
                    </p>
                </header>

                {/* Tools Grid Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => {
                        const isActive = tool.status === "Active";

                        return (
                            <div
                                key={index}
                                className="group relative bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 backdrop-blur-md hover:-translate-y-1"
                            >
                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span
                                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${isActive
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
                                            }`}
                                    >
                                        {tool.status}
                                    </span>
                                </div>

                                {/* Tool Content */}
                                <div>
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        {tool.icon}
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                                        {tool.name}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-200 mt-2 line-clamp-2 leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>

                                {/* Action Link Button */}
                                <div className="mt-6">
                                    {isActive ? (
                                        <Link
                                            href={tool.href}
                                            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/10"
                                        >
                                            Open Tool
                                            <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 bg-slate-800 border border-slate-700/50 cursor-not-allowed"
                                        >
                                            Locked
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
