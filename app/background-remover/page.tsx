"use client";

import { useState } from "react";
import Link from "next/link";
import { removeBackground } from "@imgly/background-removal";

export default function BackgroundRemover() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null);
    const [inputPreviewUrl, setInputPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStatus, setLoadingStatus] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files) {
            const file = e.target.files[0];
            setImageFile(file);
            setOutputImageUrl(null);
            setLoadingStatus("");
            setInputPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveBackground = async () => {
        if (!imageFile) return;
        setLoading(true);
        setLoadingStatus("Downloading AI Model... (First time may take a few seconds)");

        try {
            const processedBlob = await removeBackground(imageFile, {
                progress: (key, current, total) => {
                    if (key.includes("fetch")) {
                        setLoadingStatus(`Loading AI Network: ${Math.round((current / total) * 100)}%`);
                    } else {
                        setLoadingStatus("AI is segmenting your image...");
                    }
                },
            });

            const url = URL.createObjectURL(processedBlob);
            setOutputImageUrl(url);
            setLoadingStatus("Success! Background removed completely.");
        } catch (error) {
            console.error("AI processing failed:", error);
            setLoadingStatus("Failed to process image. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const downloadResult = async () => {
        if (!outputImageUrl || !imageFile) return;

        if ("showSaveFilePicker" in window) {
            try {
                const defaultName = `no-bg-${imageFile.name.split(".")[0]}.png`;
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: defaultName,
                    types: [
                        {
                            description: "PNG Image (Transparent)",
                            accept: { "image/png": [".png"] },
                        },
                    ],
                });

                const writable = await handle.createWritable();
                const response = await fetch(outputImageUrl);
                const blob = await response.blob();
                await writable.write(blob);
                await writable.close();
            } catch (err) {
                console.log("Save As cancelled");
            }
        } else {
            const link = document.createElement("a");
            link.href = outputImageUrl;
            link.download = `no-bg-${imageFile.name.split(".")[0]}.png`;
            link.click();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">

            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Back Button */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl shadow-lg border border-white/10 backdrop-blur-md transition-all active:scale-95"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            {/* Main Card */}
            <div className="relative z-10 bg-slate-800/40 border border-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md max-w-md w-full text-center mt-14 sm:mt-0">

                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg mb-3">
                        ✨
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">AI Background Remover</h1>
                    <p className="text-xs text-slate-400 mt-1">Remove backgrounds automatically inside your browser via local AI</p>
                </div>

                {/* Upload Zone */}
                <div className="relative group border-2 border-dashed border-slate-700 hover:border-purple-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-900/30 hover:bg-slate-900/50 mb-6">
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={loading}
                    />
                    <div className="space-y-2">
                        <svg className="mx-auto h-8 w-8 text-slate-500 group-hover:text-purple-400 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-slate-300">
                            <span className="font-semibold text-purple-400 hover:text-purple-300">Upload a photograph</span> or drop here
                        </div>
                        <p className="text-xs text-slate-500">Supports JPG, PNG up to 5MB</p>
                    </div>
                </div>
                {/* Selected Image Preview */}
                {inputPreviewUrl && (
                    <div className="mb-6 p-3 bg-slate-900/40 rounded-xl border border-slate-700/50 flex items-center gap-3 text-left">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0">
                            <img src={inputPreviewUrl} alt="Original Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">{imageFile?.name || "Selected Image"}</p>
                            <p className="text-[10px] text-purple-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span>
                                Ready for AI processing
                            </p>
                        </div>
                    </div>
                )}


                {/* Status Messages / Progress Bar */}
                {loadingStatus && (
                    <div className="mb-6 p-3.5 bg-slate-900/50 border border-slate-700/60 rounded-xl text-xs font-medium text-purple-300 tracking-wide animate-pulse">
                        🤖 {loadingStatus}
                    </div>
                )}

                {/* Result Preview Box (Shows checkerboard transparent background pattern) */}
                {outputImageUrl && (
                    <div className="mb-6 p-2 bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-left pl-1">AI Output (Transparent PNG)</p>
                        <div
                            className="max-h-48 rounded border border-slate-700 flex items-center justify-center overflow-hidden bg-slate-950 shadow-inner"
                            style={{ backgroundImage: "linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }}
                        >
                            <img src={outputImageUrl} alt="No BG Output" className="max-h-44 object-contain" />
                        </div>
                    </div>
                )}

                {/* Action Controls */}
                {!outputImageUrl ? (
                    <button
                        onClick={handleRemoveBackground}
                        disabled={!imageFile || loading}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${imageFile && !loading
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/20 transform hover:-translate-y-0.5 cursor-pointer"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                            }`}
                    >
                        {loading ? "AI is processing..." : "Remove Background"}
                    </button>
                ) : (
                    <button
                        onClick={downloadResult}
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5 cursor-pointer transition-all"
                    >
                        Download PNG (Transparent)
                    </button>
                )}

            </div>
        </div>
    );
}
