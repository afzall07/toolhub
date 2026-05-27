'use client';
import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import Link from 'next/link';

export default function EncryptTextPage() {
    // Left Side (Encryption) States
    const [encInput, setEncInput] = useState('');
    const [useEncKey, setUseEncKey] = useState(true);
    const [encKey, setEncKey] = useState('');
    const [encOutput, setEncOutput] = useState('');

    // Right Side (Decryption) States
    const [decInput, setDecInput] = useState('');
    const [useDecKey, setUseDecKey] = useState(true);
    const [decKey, setDecKey] = useState('');
    const [decOutput, setDecOutput] = useState('');
    const [copied, setCopied] = useState<string | null>(null);


    const generateRandomKey = (length = 16): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    const encryptWithPassword = (text: string, secretKey: string) => {
        if (!text) return '';
        const key = secretKey || 'DefaultInternalKey123';
        try {
            return CryptoJS.AES.encrypt(text, key).toString();
        } catch (err) {
            return 'Error: Encryption failed.';
        }
    }

    const decryptWithPassword = (cipherText: string, secretKey: string): string => {
        if (!cipherText) return '';
        const key = secretKey || 'DefaultInternalKey123';
        try {
            const bytes = CryptoJS.AES.decrypt(cipherText.trim(), key);
            const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedText) return 'Error: Invalid key or corrupted data.';
            return decryptedText;
        } catch (err) {
            return 'Error: Decryption failed.';
        }
    }

    // Actions
    const handleEncryptAction = () => {
        const actualKey = useEncKey ? encKey : '';
        const result = encryptWithPassword(encInput, actualKey);
        setEncOutput(result);
    };

    const handleDecryptAction = () => {
        const actualKey = useDecKey ? decKey : '';
        const result = decryptWithPassword(decInput, actualKey);
        setDecOutput(result);
    };
    const handleGenRandomKey = () => {
        const randomKey = generateRandomKey(12);
        setEncKey(randomKey);
    };



    const handleCopy = (text: string, type: string) => {
        if (!text || text.startsWith('Error')) return;
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-8 antialiased selection:bg-orange-500 selection:text-white relative">

            {/* Premium Glassmorphic Back Button */}
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

                {/* Header Title */}
                <header className="text-center space-y-2 pt-16 sm:pt-12 pb-2">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-amber-400 via-orange-500 to-red-400 bg-clip-text text-transparent">
                        Text Encryption & Decryption Hub
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto font-medium">
                        Securely scramble and decode strings side-by-side using robust AES methodologies.
                    </p>
                </header>

                {/* Two Column Grid Setup */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

                    {/* LEFT SIDE PANEL: TEXT ENCRYPTION */}
                    <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
                        <div className="space-y-4 grow flex flex-col">
                            <h2 className="text-lg font-bold tracking-wide text-slate-200 border-b border-slate-800/80 pb-2">Text Encryption</h2>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400">Enter any text to be Encrypted</label>
                                <textarea
                                    value={encInput}
                                    onChange={(e) => setEncInput(e.target.value)}
                                    placeholder="Type plain message here..."
                                    className="w-full h-28 p-3 border border-slate-800 rounded-xl bg-slate-950 text-white placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-orange-500 transition-all resize-none"
                                />
                            </div>

                            {/* Checkbox Configuration */}
                            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                                <input
                                    type="checkbox"
                                    checked={useEncKey}
                                    onChange={(e) => setUseEncKey(e.target.checked)}
                                    className="accent-orange-500 h-4 w-4 cursor-pointer"
                                />
                                Encrypt with a custom secret key
                            </label>

                            {/* Conditional Secret Key Row */}
                            {useEncKey && (
                                <div className="space-y-1.5 animate-fade-in">
                                    <label className="text-xs font-bold text-orange-400">Enter Secret Key</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={encKey}
                                            onChange={(e) => setEncKey(e.target.value)}
                                            placeholder="Enter custom password..."
                                            className="w-full px-3 py-2 border border-slate-800 rounded-xl bg-slate-950 font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenRandomKey}
                                            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-colors shrink-0"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleEncryptAction}
                                className="w-full sm:w-auto self-start bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-orange-600/10 active:scale-[0.98] transition-all text-sm uppercase tracking-wider"
                            >
                                Encrypt
                            </button>

                            <div className="space-y-1.5 pt-2 grow flex flex-col">
                                <label className="text-xs font-bold text-slate-400">Encrypted Output</label>
                                <textarea
                                    readOnly
                                    value={encOutput}
                                    placeholder="Cipher output block displays here..."
                                    className="w-full grow min-h-20 p-3 border border-slate-800 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-none resize-none"
                                />
                                {encOutput && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(encOutput, 'enc')}
                                        className="w-full sm:w-auto self-start bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold py-2 px-4 rounded-xl transition-all"
                                    >
                                        {copied === 'enc' ? 'Copied! ✓' : 'Copy Output'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* RIGHT SIDE PANEL: TEXT DECRYPTION */}
                    <section className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
                        <div className="space-y-4 grow flex flex-col">
                            <h2 className="text-lg font-bold tracking-wide text-slate-200 border-b border-slate-800/80 pb-2">Text Decryption</h2>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400">Enter Encrypted Text to Decrypt</label>
                                <textarea
                                    value={decInput}
                                    onChange={(e) => setDecInput(e.target.value)}
                                    placeholder="Paste encrypted base64 payload string here..."
                                    className="w-full h-28 p-3 border border-slate-800 rounded-xl bg-slate-950 text-white placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-orange-500 transition-all resize-none"
                                />
                            </div>

                            {/* Checkbox Configuration */}
                            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300 select-none">
                                <input
                                    type="checkbox"
                                    checked={useDecKey}
                                    onChange={(e) => setUseDecKey(e.target.checked)}
                                    className="accent-orange-500 h-4 w-4 cursor-pointer"
                                />
                                Decryption requires a custom secret key
                            </label>

                            {/* Conditional Secret Key Input */}
                            {useDecKey && (
                                <div className="space-y-1.5 animate-fade-in">
                                    <label className="text-xs font-bold text-orange-400">Enter Secret Key</label>
                                    <input
                                        type="text"
                                        value={decKey}
                                        onChange={(e) => setDecKey(e.target.value)}
                                        placeholder="Enter authentication key..."
                                        className="w-full px-3 py-2 border border-slate-800 rounded-xl bg-slate-950 font-mono text-sm text-white focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={handleDecryptAction}
                                className="w-full sm:w-auto self-start bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-orange-600/10 active:scale-[0.98] transition-all text-sm uppercase tracking-wider"
                            >
                                Decrypt
                            </button>

                            <div className="space-y-1.5 pt-2 grow flex flex-col">
                                <label className="text-xs font-bold text-slate-400">Decrypted Text</label>
                                <textarea
                                    readOnly
                                    value={decOutput}
                                    placeholder="Original deciphered readable string text displays here..."
                                    className="w-full grow min-h-20 p-3 border border-slate-800 rounded-xl bg-slate-950 text-white font-mono text-sm focus:outline-none resize-none"
                                />
                                {decOutput && !decOutput.startsWith('Error') && (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(decOutput, 'dec')}
                                        className="w-full sm:w-auto self-start bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-bold py-2 px-4 rounded-xl transition-all"
                                    >
                                        {copied === 'dec' ? 'Copied! ✓' : 'Copy Text'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

