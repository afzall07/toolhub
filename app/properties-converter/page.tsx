'use client';
import { useState, useEffect } from 'react';
import { masterConvert } from '@/utils/yml-converter';
import Link from 'next/link';

export default function PropertiesConverterPage() {
    const [sourceFormat, setSourceFormat] = useState('.properties');
    const [targetFormat, setTargetFormat] = useState('JSON');
    const [inputText, setInputText] = useState('name=user\nage=21');
    const [outputText, setOutputText] = useState('');
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        const result = masterConvert(inputText, sourceFormat, targetFormat);
        setOutputText(result);
    }, [inputText, sourceFormat, targetFormat]);

    const handleCopy = () => {
        if (!outputText) return;
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!outputText) return;
        const ext = targetFormat === '.properties' ? 'properties' : targetFormat.toLowerCase();
        const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `config-export.${ext}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSwap = () => {
        setSourceFormat(targetFormat);
        setTargetFormat("");
        setInputText(outputText.startsWith('Error') ? '' : outputText);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 antialiased selection:bg-blue-500 selection:text-white relative">
            <div className="w-full max-w-6xl mx-auto">
                <div className="mb-6 md:absolute md:top-6 md:left-8 md:z-20">
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
            </div>
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <header className="text-center space-y-2 py-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                        Universal Config Converter
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-medium">
                        100% Client-Side Multi-Format Transform Engine. <span className="text-emerald-400 text-[11px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 ml-1 font-bold">Secure</span>
                    </p>
                </header>

                {/* Workspace Grid Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">

                    {/* Left Block - Source Input */}
                    <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4 h-115">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Source Format</label>
                            <select
                                value={sourceFormat}
                                onChange={(e) => setSourceFormat(e.target.value)}
                                className="w-full py-2 px-3 border border-slate-800 rounded-xl bg-slate-950 font-semibold text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value=".properties">.properties</option>
                                <option value="JSON">JSON</option>
                                <option value="YAML">YAML</option>
                            </select>
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={`Enter code matching ${sourceFormat} format here...`}
                            className="w-full grow p-4 border border-slate-800 rounded-xl bg-slate-950 text-slate-200 placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
                        />

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setInputText('')}
                                className="text-[11px] px-3 py-1.5 rounded-lg border border-red-950 bg-red-950/20 hover:bg-red-900/40 text-red-400 font-medium transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Middle Conversion Swapper Control Row */}
                    <div className="lg:col-span-2 flex lg:flex-col justify-center gap-3 py-2 lg:py-0">
                        <button
                            type="button"
                            onClick={handleSwap}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 p-2.5 rounded-xl shadow-md transition-all active:scale-95 text-lg"
                            title="Swap Formats"
                        >
                            ⇄
                        </button>
                    </div>

                    {/* Right Block - Target Output Results */}
                    <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4 h-115">
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target Format</label>
                            <select
                                value={targetFormat}
                                onChange={(e) => setTargetFormat(e.target.value)}
                                className="w-full py-2 px-3 border border-slate-800 rounded-xl bg-slate-950 font-semibold text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value=".properties">.properties</option>
                                <option value="JSON">JSON</option>
                                <option value="YAML">YAML</option>
                            </select>
                        </div>

                        <textarea
                            readOnly
                            value={outputText}
                            placeholder="Your structural output transformation results will appear here securely..."
                            className="w-full grow p-4 border border-slate-800 rounded-xl bg-slate-950/60 text-cyan-400 font-mono text-sm focus:outline-none resize-none"
                        />

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCopy}
                                disabled={!outputText || outputText.startsWith('Error')}
                                className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-blue-400 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {copied ? 'Copied! ✓' : 'Copy Output'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={!outputText || outputText.startsWith('Error')}
                                className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Download File
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
