"use client";
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function JWTDecoder() {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState<any>(null);
    const [payload, setPayload] = useState<any>(null);
    const [signature, setSignature] = useState<string>("")
    const [expiryStatus, setExpiryStatus] = useState<{ status: string; date: string } | null>(null);
    const [error, setError] = useState('');
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const handleDecode = () => {
        setError('');
        setSignature('')
        setHeader(null);
        setPayload(null);
        setExpiryStatus(null);

        if (!token.trim()) {
            setError('Please paste a token first.');
            return;
        }

        try {
            // split JWT parts (.)
            const tokenParts = token.trim().split('.');
            if (tokenParts.length !== 3) {
                setError('Invalid JWT format. A valid JWT must have 3 parts separated by dots.');
                return;
            }

            // 1. decoding header
            const decodedHeader = JSON.parse(atob(tokenParts[0]));
            setHeader(decodedHeader);

            // 2. Payload decoding 
            const decodedPayload = jwtDecode(token);
            setPayload(decodedPayload);
            // 3. Signature
            setSignature(tokenParts[2]);
            // Expiry Check Logic
            if (decodedPayload && decodedPayload.exp) {
                const expiryTimeInSeconds = decodedPayload.exp
                const expiryDate = new Date(expiryTimeInSeconds * 1000) // Seconds converted into milliseconds
                const currentTimeInSeconds = Math.floor(Date.now() / 1000)

                const formattedDate = expiryDate.toLocaleString()  // Readable format (DD/MM/YYYY, HH:MM:SS)

                if (currentTimeInSeconds > expiryTimeInSeconds) {
                    setExpiryStatus({
                        status: "Expired 🔴",
                        date: formattedDate
                    })
                } else {
                    setExpiryStatus({
                        status: 'Active (Valid) 🟢',
                        date: formattedDate
                    })
                }
            } else {
                setExpiryStatus({
                    status: 'No Expiry Set ⚪',
                    date: 'This token does not have an "exp" field.'
                });
            }
        } catch (err) {
            setError('Invalid JWT Token. Please check your token format.');
        }
    };
    const handleClear = () => {
        setToken('');
        setHeader(null);
        setPayload(null);
        setSignature('');
        setExpiryStatus(null);
        setError('');
    };
    const handleCopy = (text: string, sectionName: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedSection(sectionName);
            setTimeout(() => setCopiedSection(null), 2000); // 2 second baad text normal ho jayega
        });
    };

    return (
        <main className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 relative">
            {/* Fixed & Responsive Back Button Container */}
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

            {/* Main Content Wrapper - Added padding top for desktop to avoid absolute overlay */}
            <div className="max-w-5xl mx-auto md:pt-16">
                <h1 className="text-3xl font-bold mb-2">Premium JWT Decoder</h1>
                <p className="text-gray-400 mb-6">Decode your JSON Web Tokens locally in your browser safely.</p>

                {/* Input Box */}
                <div className="mb-4">
                    <textarea
                        className="w-full h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 font-mono text-sm"
                        placeholder="Paste your JWT token here..."
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                </div>

                {/* Decode & Clear Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={handleDecode}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                    >
                        Decode Token
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition duration-200"
                    >
                        Clear All
                    </button>
                </div>

                {/* Error Message */}
                {error && <div className="p-4 mb-6 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">{error}</div>}

                {/* Expiry Status Banner */}
                {expiryStatus && (
                    <div className={`p-4 mb-6 rounded-lg border ${expiryStatus.status.includes('Expired')
                        ? 'bg-red-950/40 border-red-800 text-red-200'
                        : expiryStatus.status.includes('Active')
                            ? 'bg-green-950/40 border-green-800 text-green-200'
                            : 'bg-gray-800 border-gray-700 text-gray-300'
                        }`}>
                        <h3 className="font-semibold text-lg mb-1">Token Status: {expiryStatus.status}</h3>
                        <p className="text-sm opacity-90">Expiry Time: {expiryStatus.date}</p>
                    </div>
                )}

                {/* Output Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Header Section */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 relative group">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold text-red-400">Header</h2>
                            {header && (
                                <button
                                    onClick={() => handleCopy(JSON.stringify(header, null, 2), 'header')}
                                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2.5 py-1 rounded text-gray-200 transition"
                                >
                                    {copiedSection === 'header' ? 'Copied! ✅' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <pre className="bg-gray-950 p-3 rounded font-mono text-sm overflow-x-auto text-green-400 min-h-37.5">
                            {header ? JSON.stringify(header, null, 2) : '// Click Decode Token to see header'}
                        </pre>
                    </div>

                    {/* Payload Section */}
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 relative group">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold text-blue-400">Payload</h2>
                            {payload && (
                                <button
                                    onClick={() => handleCopy(JSON.stringify(payload, null, 2), 'payload')}
                                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2.5 py-1 rounded text-gray-200 transition"
                                >
                                    {copiedSection === 'payload' ? 'Copied! ✅' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <pre className="bg-gray-950 p-3 rounded font-mono text-sm overflow-x-auto text-yellow-400 min-h-37.5">
                            {payload ? JSON.stringify(payload, null, 2) : '// Click Decode Token to see payload'}
                        </pre>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-semibold text-pink-400">Signature</h2>
                        {signature && (
                            <button
                                onClick={() => handleCopy(signature, 'signature')}
                                className="text-xs bg-gray-700 hover:bg-gray-600 px-2.5 py-1 rounded text-gray-200 transition"
                            >
                                {copiedSection === 'signature' ? 'Copied! ✅' : 'Copy'}
                            </button>
                        )}
                    </div>
                    <div className="bg-gray-950 p-3 rounded font-mono text-sm break-all text-pink-300 min-h-15">
                        {signature ? signature : '// Click Decode Token to see signature hash'}
                    </div>
                </div>
            </div>
        </main>

    );
}
