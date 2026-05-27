'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Base64ConverterPage() {
    const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
    const [inputText, setInputText] = useState('Hello World!');
    const [outputText, setOutputText] = useState('');
    const [copied, setCopied] = useState(false);


    // 1. normal text to Base64 (Handles UTF-8 safely)
    const handleEncodeBase64 = (text: string) => {
        try {
            if (!text) return '';
            const bytes = new TextEncoder().encode(text);
            const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
            return btoa(binString);
        } catch (err) {
            return 'Error: Could not encode text to Base64.';
        }
    }

    // 2. Base64 to normal text
    const handleDecodeBase64 = (base64Text: string) => {
        try {
            if (!base64Text) return '';
            const binString = atob(base64Text.trim());
            const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
            return new TextDecoder().decode(bytes);
        } catch (err) {
            return 'Error: Invalid Base64 string provided.';
        }
    }


    // live encoding/decoding
    useEffect(() => {
        if (!inputText.trim()) {
            setOutputText('');
            return;
        }

        if (operation === 'encode') {
            setOutputText(handleEncodeBase64(inputText));
        } else {
            setOutputText(handleDecodeBase64(inputText));
        }
    }, [inputText, operation]);

    const handleCopy = () => {
        if (!outputText || outputText.startsWith('Error')) return;
        navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setInputText('');
        setOutputText('');
    };

    const handleToggle = (mode: 'encode' | 'decode') => {
        setOperation(mode);
        if (outputText && !outputText.startsWith('Error')) {
            setInputText(outputText);
        } else {
            setInputText('');
        }
    };
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 antialiased selection:bg-orange-500 selection:text-white relative">

            {/* 1. Back Button Block - Responsive positioning with proper margins */}
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

            <div className="max-w-6xl mx-auto space-y-8">

                {/* 2. Header Block - Added extra top padding (pt-16 sm:pt-12) to clear space for the absolute button */}
                <header className="text-center space-y-2 pt-16 sm:pt-12 pb-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-amber-400 via-orange-500 to-red-400 bg-clip-text text-transparent">
                        Base64 Encode And Decode Online
                    </h1>
                    <p className="text-slate-200 text-sm md:text-base max-w-md mx-auto font-medium">
                        Encode or Decode data instantly with high-visibility, large text fields.
                    </p>
                </header>

                {/* Operation Selector Tabs */}
                <div className="flex justify-center">
                    <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex gap-2">
                        <button
                            type="button"
                            onClick={() => handleToggle('encode')}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${operation === 'encode' ? 'bg-linear-to-r from-amber-600 to-orange-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Encode Text
                        </button>
                        <button
                            type="button"
                            onClick={() => handleToggle('decode')}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${operation === 'decode' ? 'bg-linear-to-r from-orange-600 to-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Decode Base64
                        </button>
                    </div>
                </div>

                {/* Main Double Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

                    {/* Input Box Panel */}
                    <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 min-h-100">
                        <div className="space-y-3 grow flex flex-col">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                                    {operation === 'encode' ? 'Plain Text Input' : 'Base64 Input String'}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-xs bg-red-950/20 hover:bg-red-900/30 text-red-400 px-2.5 py-1 rounded-lg border border-red-900/30 transition-colors font-medium"
                                >
                                    Clear Area
                                </button>
                            </div>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={operation === 'encode' ? 'Type or paste plain text here...' : 'Paste Base64 code here...'}
                                className="w-full grow p-4 border border-slate-800 rounded-xl bg-slate-950 text-white placeholder-slate-500 font-mono text-base md:text-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                            />
                        </div>
                    </section>

                    {/* Output Box Panel */}
                    <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4 min-h-100">
                        <div className="space-y-3 grow flex flex-col">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                                    {operation === 'encode' ? 'Base64 Output Result' : 'Plain Text Output Result'}
                                </span>
                                {outputText && !outputText.startsWith('Error') && (
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="text-xs bg-orange-600/10 hover:bg-orange-600 border border-orange-500/20 text-orange-400 hover:text-white px-3 py-1 rounded-lg transition-all font-semibold"
                                    >
                                        {copied ? 'Copied! ✓' : 'Copy Result'}
                                    </button>
                                )}
                            </div>

                            <textarea
                                readOnly
                                value={outputText}
                                placeholder="The output result string will display here with clear visibility..."
                                className={`w-full grow p-4 border rounded-xl bg-slate-950 text-white font-mono text-base md:text-lg focus:outline-none resize-none ${outputText.startsWith('Error') ? 'border-red-500/40 text-red-400' : 'border-slate-800 text-emerald-400'}`}
                            />
                        </div>
                    </section>

                </div>
            </div>
        </div>

    );
}
