"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TimeZoneConverter() {
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [convertedTimes, setConvertedTimes] = useState<{ zone: string; time: string }[]>([]);

    // मुख्य टाइम ज़ोन्स की लिस्ट जिन्हें हमें ट्रैक करना है
    const targetZones = [
        { name: "India (IST)", id: "Asia/Kolkata" },
        { name: "United Kingdom (BST/GMT)", id: "Europe/London" },
        { name: "United States (EST)", id: "America/New_York" },
        { name: "United States (PST)", id: "America/Los_Angeles" },
        { name: "Japan (JST)", id: "Asia/Tokyo" },
        { name: "Australia (AEST)", id: "Australia/Sydney" },
    ];

    // शुरुआत में करंट लोकल टाइम को इनपुट में सेट करना
    useEffect(() => {
        const now = new Date();
        // HTML datetime-local इनपुट के फॉर्मेट (YYYY-MM-DDTHH:MM) में बदलना
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
        setSelectedTime(localISOTime);
    }, []);

    // जब भी इनपुट टाइम बदलेगा, सभी टाइम ज़ोन्स का समय कैलकुलेट होगा
    useEffect(() => {
        if (!selectedTime) return;

        const baseDate = new Date(selectedTime);

        const updatedTimes = targetZones.map((zone) => {
            // JavaScript का इन-बिल्ट Intl API समय को कन्वर्ट करने के लिए
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: zone.id,
                dateStyle: "medium",
                timeStyle: "short",
                hour12: true,
            });

            return {
                zone: zone.name,
                time: formatter.format(baseDate),
            };
        });

        setConvertedTimes(updatedTimes);
    }, [selectedTime]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">

            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

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

            {/* Main Converter Card */}
            <div className="relative z-10 bg-slate-800/40 border border-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl backdrop-blur-md max-w-lg w-full mt-14 sm:mt-0">

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl shadow-lg mb-3">
                        ⏰
                    </div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">Time Zone Converter</h1>
                    <p className="text-xs text-slate-400 mt-1">Select your time and see it instantly across the world</p>
                </div>

                {/* Time Selector Input Zone */}
                <div className="mb-6 bg-slate-900/30 border border-slate-700/40 p-4 rounded-xl">
                    <label className="block text-xs font-bold text-amber-400 tracking-wider uppercase mb-2">
                        Select Base Time (Your Local Time)
                    </label>
                    <input
                        type="datetime-local"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-slate-100 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 cursor-pointer font-medium text-sm"
                    />
                </div>

                {/* Converted Times Output Grid */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                    <p className="text-xs font-bold text-slate-500 tracking-wider uppercase pl-1">Converted World Times</p>

                    {convertedTimes.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-700/40 hover:border-slate-600/60 rounded-xl transition-colors"
                        >
                            <span className="text-xs sm:text-sm font-semibold text-slate-300">{item.zone}</span>
                            <span className="text-xs sm:text-sm font-bold text-amber-400 tracking-wide bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-lg">
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
