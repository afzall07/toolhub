"use client";
import { useState, useEffect } from 'react';
import { testRegexPattern, RegexMatchResult } from '@/utils/regex';
import Link from 'next/link';

const PREDEFINED_PATTERNS = [
    { label: "Choose a pattern...", value: "" },
    { label: "Email Address", value: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
    { label: "Phone Number (India)", value: "^[6-9]\\d{9}$" },
    { label: "URL / Website", value: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" },
    { label: "Numeric Only", value: "^[0-9]+$" },
    { label: "Alpha-Numeric", value: "^[a-zA-Z0-9]+$" },
    { label: "Strong Password", value: "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$" }, // Min 8 chars, 1 letter, 1 number
];


export default function RegexTesterPage() {
    const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
    const [text, setText] = useState('Contact us at support@example.com or admin@domain.co.in for help.');
    const [flags, setFlags] = useState({ global: true, ignoreCase: true, multiline: false });
    const [matches, setMatches] = useState<RegexMatchResult[]>([]);
    const [regexError, setRegexError] = useState<string | null>(null);
    const [copiedType, setCopiedType] = useState<string | null>(null);

    useEffect(() => {
        const result = testRegexPattern(pattern, text, flags);
        setRegexError(result.error);
        setMatches(result.matches);
    }, [pattern, text, flags]);

    const handleCopy = (content: string, type: string) => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 antialiased selection:bg-cyan-500 selection:text-slate-950 relative">
            <div className="w-full max-w-5xl mx-auto mb-6 md:absolute md:top-8 md:left-8 lg:left-12 z-20">
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
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header Block */}
                <header className="text-center space-y-2 py-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
                        Smart Regex Tester & Generator
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-medium">
                        Test, validate, and debug regular expressions in real-time with group tracking.
                    </p>
                </header>
                {/* Top Selection Row: Enter vs Generate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-900/40 border border-slate-800 p-5 rounded-2xl mb-6">
                    {/* Left Info Column */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">Option A: Manual Entry</h3>
                        <p className="text-sm text-slate-200 mt-1">You can type your custom regular expression directly in the workspace setup below.</p>
                    </div>

                    {/* Right Generator Dropdown Column */}
                    <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                                ✨ Option B: Generate a regex
                            </label>
                        </div>

                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    setPattern(e.target.value);
                                }
                            }}
                            className="w-full py-2.5 px-3 border border-slate-800 rounded-xl bg-slate-950 font-medium text-sm text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer transition-colors"
                        >
                            {PREDEFINED_PATTERNS.map((item, index) => (
                                <option key={index} value={item.value} className="bg-slate-950 text-slate-300">
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>


                {/* Responsive Grid Setup */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* Section 01: Setup Form Configurations */}
                    <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                                01
                            </span>
                            <h2 className="text-base font-semibold tracking-wide text-slate-200">Expression Setup</h2>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Regular Expression</label>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(pattern, 'pat')}
                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition-colors"
                                >
                                    {copiedType === 'pat' ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-slate-500 font-mono text-sm">/</span>
                                <input
                                    type="text"
                                    value={pattern}
                                    onChange={(e) => setPattern(e.target.value)}
                                    placeholder="Enter regex pattern here..."
                                    className={`w-full pl-6 pr-14 py-2.5 border rounded-xl bg-slate-950 font-mono text-sm text-slate-200 focus:outline-none transition-colors placeholder-slate-400/80 font-medium ${regexError ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500'}`}
                                />
                                <span className="absolute right-3 text-slate-500 font-mono text-sm">
                                    /{flags.global ? 'g' : ''}{flags.ignoreCase ? 'i' : ''}{flags.multiline ? 'm' : ''}
                                </span>
                            </div>
                            {regexError && (
                                <p className="text-red-400 text-[11px] font-medium leading-tight pt-1 animate-pulse">⚠️ {regexError}</p>
                            )}
                        </div>

                        <div className="space-y-3 pt-2 border-t border-slate-800/60">
                            <label className="text-[13px] font-bold text-slate-300 uppercase tracking-wider block">Flags (Modifiers)</label>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/50 cursor-pointer hover:bg-slate-950 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-300">Global (g)</span>
                                        <span className="text-[12px] text-slate-200">Don't return after first match</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={flags.global}
                                        onChange={(e) => setFlags({ ...flags, global: e.target.checked })}
                                        className="accent-cyan-500 h-4 w-4 cursor-pointer"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/50 cursor-pointer hover:bg-slate-950 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-200">Case Insensitive (i)</span>
                                        <span className="text-[12px] text-slate-300">Ignore case differences</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={flags.ignoreCase}
                                        onChange={(e) => setFlags({ ...flags, ignoreCase: e.target.checked })}
                                        className="accent-cyan-500 h-4 w-4 cursor-pointer"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/50 cursor-pointer hover:bg-slate-950 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-200">Multiline (m)</span>
                                        <span className="text-[12px] text-slate-300">Enable line anchors tracking</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={flags.multiline}
                                        onChange={(e) => setFlags({ ...flags, multiline: e.target.checked })}
                                        className="accent-cyan-500 h-4 w-4 cursor-pointer"
                                    />
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Right Dual Column Layout Split Box */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">

                        {/* Panel 02: Main Target Area Field Block */}
                        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
                            <div className="space-y-4 grow flex flex-col">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                            02
                                        </span>
                                        <h2 className="text-base font-semibold tracking-wide text-slate-200">Test String</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(text, 'txt')}
                                        className="text-[10px] bg-slate-800/50 text-slate-400 px-2 py-0.5 rounded transition-colors hover:text-slate-200"
                                    >
                                        {copiedType === 'txt' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>

                                <div className="grow relative flex flex-col pt-1">
                                    <textarea
                                        placeholder="Type or paste the text string you want to validate patterns against..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="w-full grow min-h-65 p-3 border border-slate-800 rounded-xl bg-slate-950 text-slate-200 placeholder-slate-400/80 font-medium text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Panel 03: Engine Match Track Statistics Display */}
                        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                                        03
                                    </span>
                                    <h2 className="text-base font-semibold tracking-wide text-slate-200">Match Analysis</h2>
                                </div>
                                <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
                                    {matches.length} Matches
                                </span>
                            </div>

                            {/* Match list wrapper */}
                            <div className="w-full grow rounded-xl bg-slate-950/80 border border-slate-800 p-3 overflow-y-auto max-h-70 scrollbar-thin space-y-2">
                                {matches.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-slate-600 text-xs py-12 font-medium">
                                        No matching patterns found in the provided string.
                                    </div>
                                ) : (
                                    matches.map((item, idx) => (
                                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/60 text-xs space-y-1.5">
                                            <div className="flex justify-between items-center">
                                                <span className="font-mono text-cyan-400 font-semibold bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-900/40">
                                                    Match {idx + 1}: "{item.matchedText}"
                                                </span>
                                                <span className="text-[10px] text-slate-500">Index: {item.index}</span>
                                            </div>
                                            {item.groups.length > 0 && (
                                                <div className="pt-1 pl-2 border-l border-slate-700/60 space-y-0.5">
                                                    {item.groups.map((grp, gIdx) => (
                                                        <p key={gIdx} className="text-[11px] font-mono text-slate-400">
                                                            <span className="text-indigo-400">Group {gIdx + 1}:</span> "{grp}"
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}
