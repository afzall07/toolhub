"use client";

import { useState } from "react";
import Link from "next/link";
import imageCompression from "browser-image-compression";

export default function ImageCompressor() {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [compressedImage, setCompressedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressing, setCompressing] = useState<boolean>(false);
    const [maxSizeKB, setMaxSizeKB] = useState<number>(500); // 500 KB


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setOriginalImage(file);
            setCompressedImage(null);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // const handleCompress = async () => {
    //     if (!originalImage) return;

    //     setCompressing(true);

    //     // कम्प्रेशन के ऑप्शन्स कॉन्फ़िगर करना
    //     const options = {
    //         maxSizeMB: maxSizeKB / 1024,
    //         maxWidthOrHeight: 1920, // मैक्सिमम रिज़ॉल्यूशन लिमिट
    //         useWebWorker: true, // बैकग्राउंड थ्रेड में प्रोसेस करने के लिए ताकि ब्राउज़र हैंग न हो
    //     };

    //     try {
    //         const compressedFile = await imageCompression(originalImage, options);
    //         setCompressedImage(compressedFile);
    //     } catch (error) {
    //         console.error("Compression failed:", error);
    //     } finally {
    //         setCompressing(false);
    //     }
    // };

    // 2. बिल्कुल सटीक (Exact) KB कम्प्रेशन करने वाला जादुई लॉजिक

    const handleCompress = async () => {
        if (!originalImage) return;

        setCompressing(true);

        try {
            const img = new Image();
            img.src = previewUrl!;

            img.onload = async () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                let width = img.width;
                let height = img.height;

                if (originalImage.size > 5 * 1024 * 1024) {
                    const scaleFactor = 0.7;
                    width *= scaleFactor;
                    height *= scaleFactor;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.90;
                let compressedBlob: Blob | null = null;
                let currentSizeKB = Infinity;

                while (currentSizeKB > maxSizeKB && quality > 0.05) {
                    compressedBlob = await new Promise<Blob | null>((resolve) =>
                        canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality)
                    );

                    if (!compressedBlob) break;

                    currentSizeKB = compressedBlob.size / 1024;

                    if (currentSizeKB > maxSizeKB) {
                        quality -= 0.05;
                    }
                }

                if (compressedBlob && (compressedBlob.size / 1024) > maxSizeKB) {
                    canvas.width = width * 0.5;
                    canvas.height = height * 0.5;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    compressedBlob = await new Promise<Blob | null>((resolve) =>
                        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.2)
                    );
                }

                if (compressedBlob) {
                    const compressedFile = new File([compressedBlob], originalImage.name, {
                        type: "image/jpeg",
                    });
                    setCompressedImage(compressedFile);
                }

                setCompressing(false);
            };
        } catch (error) {
            console.error("Compression failed:", error);
            setCompressing(false);
        }
    };


    const downloadImage = async () => {
        if (!compressedImage) return;

        if ("showSaveFilePicker" in window) {
            try {
                const defaultName = `compressed-${originalImage?.name || "image.jpg"}`;

                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: defaultName,
                    types: [
                        {
                            description: "Image File",
                            accept: {
                                [compressedImage.type]: [`.${compressedImage.type.split("/")[1]}`],
                            },
                        },
                    ],
                });

                const writable = await handle.createWritable();
                await writable.write(compressedImage);
                await writable.close();
            } catch (err) {
                console.log("Save As dialog was closed or cancelled");
            }
        } else {
            const url = URL.createObjectURL(compressedImage);
            const link = document.createElement("a");
            link.href = url;
            link.download = `compressed-${originalImage?.name || "image.jpg"}`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };


    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">

            {/* Background Decorative Circles */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

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
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-2xl shadow-lg mb-3">
                        📉
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">Image Compressor</h1>
                    <p className="text-xs text-slate-400 mt-1">Compress large images without losing visual quality</p>
                </div>

                {/* Drag & Drop Upload Zone */}
                <div className="relative group border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-900/30 hover:bg-slate-900/50 mb-6">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-2">
                        <svg className="mx-auto h-8 w-8 text-slate-500 group-hover:text-emerald-400 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-slate-300">
                            <span className="font-semibold text-emerald-400 hover:text-emerald-300">Choose an image</span> or drop here
                        </div>
                        <p className="text-xs text-slate-500">Supports JPG, PNG, WebP</p>
                    </div>
                </div>

                {/* Target Size Selector Range */}
                <div className="bg-slate-900/30 rounded-xl p-3.5 border border-slate-700/40 mb-6 text-left">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-slate-400">Target Maximum Size:</label>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {maxSizeKB} KB
                        </span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="2048"
                        step="10"
                        value={maxSizeKB}
                        onChange={(e) => setMaxSizeKB(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                    />
                </div>

                {/* Comparison Stats View */}
                {originalImage && (
                    <div className="mb-6 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 space-y-3 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0">
                                <img src={previewUrl!} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-200 truncate">{originalImage.name}</p>
                                <p className="text-[11px] text-slate-400">Original: {formatSize(originalImage.size)}</p>
                            </div>
                        </div>

                        {/* Compressed Output Stat */}
                        {compressedImage && (
                            <div className="pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-semibold text-emerald-400">Compressed: {formatSize(compressedImage.size)}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Saved: {((1 - compressedImage.size / originalImage.size) * 100).toFixed(0)}% space
                                    </p>
                                </div>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                    Success
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Button Trigger */}
                {!compressedImage ? (
                    <button
                        onClick={handleCompress}
                        disabled={!originalImage || compressing}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${originalImage && !compressing
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/20 transform hover:-translate-y-0.5 cursor-pointer"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                            }`}
                    >
                        {compressing ? "Compressing, please wait..." : "Compress Image"}
                    </button>
                ) : (
                    <button
                        onClick={downloadImage}
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5 cursor-pointer transition-all"
                    >
                        Download Compressed Image
                    </button>
                )}

            </div>
        </div>
    );
}
