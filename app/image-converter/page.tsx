"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function ImageConverter() {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [outputFormat, setOutputFormat] = useState<"jpeg" | "png">("png");
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const convertAndDownload = () => {
        if (!previewUrl || !canvasRef.current) return;

        const img = new Image();
        img.src = previewUrl;
        img.onload = () => {
            const canvas = canvasRef.current!;
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            if (outputFormat === "jpeg") {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);

            const mimeType = `image/${outputFormat}`;
            const dataUrl = canvas.toDataURL(mimeType);

            const link = document.createElement("a");
            link.download = `converted-image.${outputFormat}`;
            link.href = dataUrl;
            link.click();
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">

            {/* Background Decorative Circles (डैशबोर्ड जैसी नियॉन लाइट्स) */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Back to Dashboard Button (Top-Left Premium Style) */}
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

            {/* Main Converter Card (Glassmorphism Look) */}
            <div className="relative z-10 bg-slate-800/40 border border-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md max-w-md w-full text-center mt-14 sm:mt-0">

                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-2xl shadow-lg mb-3">
                        📸
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">Image Converter</h1>
                    <p className="text-xs text-slate-400 mt-1">Convert your images instantly in-browser safely</p>
                </div>

                {/* Premium Drag & Drop Area */}
                <div className="relative group border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-900/30 hover:bg-slate-900/50 mb-6">
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-2">
                        <svg className="mx-auto h-8 w-8 text-slate-500 group-hover:text-indigo-400 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-slate-300">
                            <span className="font-semibold text-indigo-400 hover:text-indigo-300">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-slate-500">PNG or JPG up to 10MB</p>
                    </div>
                </div>

                {/* Tiny Fixed Preview Box (Premium Dark Style) */}
                {previewUrl && (
                    <div className="mb-6 p-3 bg-slate-900/40 rounded-xl border border-slate-700/50 flex items-center gap-3 text-left">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0">
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-200 truncate">{image?.name || "image-file"}</p>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                                Ready to convert
                            </p>
                        </div>
                    </div>
                )}

                {/* Format Option Select Grid */}
                <div className="bg-slate-900/30 rounded-xl p-3.5 flex items-center justify-between border border-slate-700/40 mb-6">
                    <label className="text-xs sm:text-sm font-semibold text-slate-400">Convert to:</label>
                    <div className="relative">
                        <select
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value as "jpeg" | "png")}
                            className="appearance-none font-bold text-xs bg-slate-800 border border-slate-700 text-slate-200 py-1.5 pl-4 pr-8 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                        >
                            <option value="png">PNG Format</option>
                            <option value="jpeg">JPG / JPEG</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://w3.org" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Convert & Download Button */}
                <button
                    onClick={convertAndDownload}
                    disabled={!image}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${image
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                        }`}
                >
                    Convert & Download
                </button>

                {/* Canvas */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );

}
