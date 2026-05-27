'use client';
import { useState } from 'react';
import Link from 'next/link';
import { generatePGPKeys, encryptText, decryptText } from '@/utils/pgp';

export default function PGPPage() {
    const [pubKey, setPubKey] = useState('');
    const [privKey, setPrivKey] = useState('');
    const [inputData, setInputData] = useState('');
    const [keyInput, setKeyInput] = useState('');
    const [result, setResult] = useState('');
    const [copiedType, setCopiedType] = useState<string | null>(null);

    const handleKeyGen = async () => {
        const { publicKey, privateKey } = await generatePGPKeys('User', 'user@example.com');
        setPubKey(publicKey);
        setPrivKey(privateKey);
    };

    const handleEncrypt = async () => {
        try {
            const encrypted = await encryptText(inputData, keyInput);
            setResult(encrypted);
        } catch (err) {
            setResult('Error: Invalid Public Key or Input');
        }
    };

    const handleDecrypt = async () => {
        try {
            const decrypted = await decryptText(inputData, keyInput);
            setResult(decrypted);
        } catch (err) {
            setResult('Error: Decryption failed. Check Private Key.');
        }
    };

    const handleCopy = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 2000);
    };
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 antialiased selection:bg-indigo-500 selection:text-white relative">
            {/* Back Button */}
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

            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="text-center space-y-2 py-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        PGP Encryption & Decryption Online
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto font-medium">
                        Secure client-side encryption and decryption right in your browser.
                    </p>
                </header>

                {/* Main Grid Setup */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <section className="lg:col-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">
                                01
                            </span>
                            <h2 className="text-lg font-semibold tracking-wide text-slate-200">Key Generator</h2>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed">
                            Generate a secure ECC (ed25519) key pair instantly without risking data exposure.
                        </p>

                        <button
                            onClick={handleKeyGen}
                            className="w-full bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-[0.98] text-sm"
                        >
                            Generate New Key Pair
                        </button>

                        {pubKey && (
                            <div className="space-y-4 pt-2 animate-fade-in">
                                <div className="space-y-1.5">
                                    <div className="flex items-start justify-between gap-3">
                                        <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">Public Key</label>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(pubKey, 'publicKey')}
                                            className="shrink-0 text-[11px] px-2 py-1 rounded-md border border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500 text-indigo-300 transition-colors"
                                        >
                                            {copiedType === 'publicKey' ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <textarea
                                        readOnly
                                        value={pubKey}
                                        className="w-full h-32 p-3 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-indigo-500 transition-colors resize-none scrollbar-thin"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-start justify-between gap-3">
                                        <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Private Key (Secret)</label>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(privKey, 'privKey')}
                                            className="shrink-0 text-[11px] px-2 py-1 rounded-md border border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-500 text-indigo-300 transition-colors"
                                        >
                                            {copiedType === 'privKey' ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <textarea
                                        readOnly
                                        value={privKey}
                                        className="w-full h-32 p-3 border border-slate-800 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-emerald-500 transition-colors resize-none scrollbar-thin"
                                    />
                                </div>

                            </div>
                        )}
                    </section>

                    {/* Step 2 & 3: Workspace & Results (Right Column Grid) */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

                        {/* Operations Panel */}
                        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
                            <div className="space-y-4 grow">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-bold border border-cyan-500/20">
                                        02
                                    </span>
                                    <h2 className="text-lg font-semibold tracking-wide text-slate-200">Workspace</h2>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                                            Input
                                        </label>

                                        <textarea
                                            placeholder="Enter your plain text message or encrypted payload here..."
                                            value={inputData}
                                            onChange={(e) => setInputData(e.target.value)}
                                            className="w-full h-32 p-3 border border-slate-800 rounded-xl bg-slate-950 text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                                            Key Input
                                        </label>
                                        <textarea
                                            placeholder="Paste the target PGP Key (Public for Encrypt / Private for Decrypt)..."
                                            value={keyInput}
                                            onChange={(e) => setKeyInput(e.target.value)}
                                            className="w-full h-32 p-3 border border-slate-800 rounded-xl bg-slate-950 text-slate-200 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={handleEncrypt}
                                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 text-cyan-400 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm active:scale-[0.98]"
                                >
                                    Encrypt Data
                                </button>
                                <button
                                    onClick={handleDecrypt}
                                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500 text-emerald-400 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 text-sm active:scale-[0.98]"
                                >
                                    Decrypt Data
                                </button>
                            </div>
                        </section>

                        {/* Output Panel */}
                        <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-bold border border-emerald-500/20">
                                    03
                                </span>
                                <h2 className="text-lg font-semibold tracking-wide text-slate-200">Output Result</h2>
                            </div>

                            <div className="grow relative min-h-70 h-full flex flex-col">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(result, 'result')}
                                        className="shrink-0 text-[11px] px-2 py-1 rounded-md border border-slate-700 bg-slate-950/50 hover:bg-slate-800 hover:border-emerald-500 text-emerald-300 transition-colors"
                                    >
                                        {copiedType === 'result' ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <textarea
                                    readOnly
                                    value={result}
                                    className="w-full grow p-4 border border-slate-800 rounded-xl bg-slate-950/80 font-mono text-sm focus:outline-none resize-none scrollbar-thin"
                                    placeholder="Your cryptographic results will appear here securely..."
                                />
                            </div>
                        </section>


                    </div>
                </div>
            </div>
        </div>

    );
}
