"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function PDFCompressor() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [compressedPdf, setCompressedPdf] = useState<Uint8Array | null>(null);
    const [originalSize, setOriginalSize] = useState<number>(0);
    const [compressedSize, setCompressedSize] = useState<number>(0);
    const [compressing, setCompressing] = useState<boolean>(false);

    // 1. PDF फाइल सिलेक्ट करना
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPdfFile(file);
            setOriginalSize(file.size);
            setCompressedPdf(null); // पुराना पुराना कम्प्रेशन क्लियर करें
        }
    };

    // 2. PDF कम्प्रेशन लॉजिक
    const compressPDF = async () => {
        if (!pdfFile) return;
        setCompressing(true);

        try {
            // फाइल को ArrayBuffer में रीड करना
            const fileArrayBuffer = await pdfFile.arrayBuffer();

            // pdf-lib की मदद से PDF को लोड करना
            const pdfDoc = await PDFDocument.load(fileArrayBuffer);

            // बैकग्राउंड में PDF के स्ट्रक्चर को ऑप्टिमाइज़ और अनचाहे अनयूज़्ड ऑब्जेक्ट्स को डिलीट करना
            // (यह बिना क्वालिटी खराब किए PDF का साइज घटाता है)
            const compressedBytes = await pdfDoc.save({
                useObjectStreams: true,
                addDefaultPage: false,
            });

            setCompressedPdf(compressedBytes);
            setCompressedSize(compressedBytes.length);
        } catch (error) {
            console.error("PDF Compression failed:", error);
        } finally {
            setCompressing(false);
        }
    };

    // 3. "Save As" पॉपअप के साथ डाउनलोड हैंडलर
    const downloadPDF = async () => {
        if (!compressedPdf || !pdfFile) return;

        if ("showSaveFilePicker" in window) {
            try {
                const defaultName = `compressed-${pdfFile.name}`;
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: defaultName,
                    types: [
                        {
                            description: "PDF Document",
                            accept: { "application/pdf": [".pdf"] },
                        },
                    ],
                });

                const writable = await handle.createWritable();
                await writable.write(compressedPdf);
                await writable.close();
            } catch (err) {
                console.log("Save As cancelled");
            }
        } else {
            // फॉलबैक पुराने ब्राउज़र्स के लिए (एरर फ्री टाइप-सेफ कोड)
            const blob = new Blob([new Uint8Array(compressedPdf)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `compressed-${pdfFile.name}`;
            link.click();
            URL.revokeObjectURL(url);
        }

    };

    // साइज को सुंदर KB/MB में दिखाने के लिए
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
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

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
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 text-2xl shadow-lg mb-3">
                        📄
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">PDF Compressor</h1>
                    <p className="text-xs text-slate-400 mt-1">Compress PDF files locally and securely in your browser</p>
                </div>

                {/* Upload Zone */}
                <div className="relative group border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-900/30 hover:bg-slate-900/50 mb-6">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-2">
                        <svg className="mx-auto h-8 w-8 text-slate-500 group-hover:text-rose-400 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-slate-300">
                            <span className="font-semibold text-rose-400 hover:text-rose-300">Choose a PDF file</span> or drop here
                        </div>
                        <p className="text-xs text-slate-500">Only PDF files up to 50MB</p>
                    </div>
                </div>

                {/* Stats View */}
                {pdfFile && (
                    <div className="mb-6 p-4 bg-slate-900/40 rounded-xl border border-slate-700/50 text-left space-y-2.5">
                        <div>
                            <p className="text-xs font-semibold text-slate-200 truncate">{pdfFile.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Original Size: {formatSize(originalSize)}</p>
                        </div>

                        {compressedPdf && (
                            <div className="pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs">
                                <div>
                                    <p className="font-semibold text-rose-400">Compressed Size: {formatSize(compressedSize)}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">
                                        Saved: {((1 - compressedSize / originalSize) * 100).toFixed(0)}% storage space
                                    </p>
                                </div>
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                    Compressed
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Conditional Action Buttons */}
                {!compressedPdf ? (
                    <button
                        onClick={compressPDF}
                        disabled={!pdfFile || compressing}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 ${pdfFile && !compressing
                            ? "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/20 transform hover:-translate-y-0.5 cursor-pointer"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
                            }`}
                    >
                        {compressing ? "Compressing PDF..." : "Compress PDF"}
                    </button>
                ) : (
                    <button
                        onClick={downloadPDF}
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5 cursor-pointer transition-all"
                    >
                        Save Compressed PDF As
                    </button>
                )}

            </div>
        </div>
    );
}






