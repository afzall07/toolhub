"use client";

import { useState } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";

export default function FileToPdfConverter() {
    const [files, setFiles] = useState<File[]>([]);
    const [isConverting, setIsConverting] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
            setDownloadUrl(null);
        }
    };

    const convertToPdf = async () => {
        if (files.length === 0) return;
        setIsConverting(true);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const fileArrayBuffer = await file.arrayBuffer();

                // 2. Agar image PNG hai
                if (file.type === 'image/png') {
                    const pngImage = await pdfDoc.embedPng(fileArrayBuffer);
                    const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
                    page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });
                }
                // 3. Agar image JPEG/JPG hai
                else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
                    const jpgImage = await pdfDoc.embedJpg(fileArrayBuffer);
                    const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
                    page.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height });
                }
                // 4. Agar normal Text file (.txt) hai
                else if (file.type === 'text/plain') {
                    const text = new TextDecoder().decode(fileArrayBuffer);
                    const page = pdfDoc.addPage([600, 800]); // Standard size page
                    page.drawText(text, { x: 50, y: 750, size: 12 });
                }
            }

            // 5. PDF ko bytes me save karein aur download link banayein
            const pdfBytes = await pdfDoc.save();
            const safeBytes = new Uint8Array(pdfBytes);
            const blob = new Blob([safeBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

        } catch (error) {
            console.error('Conversion failed:', error);
            alert('File ko PDF mein convert karne mein dikkat aayi.');
        } finally {
            setIsConverting(false);
        }
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
                    <h1 className="text-xl sm:text-2xl font-extrabold text-red-100 tracking-tight">IMAGES to PDF</h1>
                    <p className="text-xl text-red-400 mt-1">Convert images to PDF in seconds.</p>
                </div>

                {/* Upload Zone */}
                <div className="relative group border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-xl p-6 text-center cursor-pointer transition-all bg-slate-900/30 hover:bg-slate-900/50 mb-6">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, text/plain"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="space-y-2">
                        <svg className="mx-auto h-8 w-8 text-slate-500 group-hover:text-rose-400 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-xl text-slate-300">
                            <span className="font-semibold text-rose-400 hover:text-rose-300">Choose a file</span> or drop here
                        </div>
                    </div>
                </div>

                {/* Stats View */}
                {files.length > 0 && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md mb-3">
                        <p className="font-semibold mb-1">Selected Files:</p>
                        <ul className="pl-5">
                            {files.map((f, index) => (
                                <li key={index}>{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                            ))}
                        </ul>
                    </div>
                )}
                <button
                    onClick={convertToPdf}
                    disabled={files.length === 0 || isConverting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md disabled:bg-gray-400 transition"
                >
                    {isConverting ? 'Converting to PDF...' : 'Convert to PDF'}
                </button>

                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        download="converted_document.pdf"
                        className="w-full mt-2 inline-block text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition"
                    >
                        Download Generated PDF
                    </a>
                )}

            </div>
        </div>
    );
}






