"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const cityDatabase = [
    { name: "India, Mumbai", tz: "Asia/Kolkata", label: "Mumbai", sub: "India Standard Time" },
    { name: "United Kingdom, London", tz: "Europe/London", label: "London", sub: "United Kingdom, England" },
    { name: "Russia, Moscow", tz: "Europe/Moscow", label: "Moscow", sub: "Russia" },
    { name: "Brazil, Americana", tz: "America/Sao_Paulo", label: "Americana", sub: "Brazil" },
    { name: "Canada, British Columbia, Vancouver", tz: "America/Vancouver", label: "Vancouver", sub: "Canada" },
    { name: "United States, New York", tz: "America/New_York", label: "New York", sub: "United States" },
    { name: "Japan, Tokyo", tz: "Asia/Tokyo", label: "Tokyo", sub: "Japan" },
    { name: "Japan, Tokyo", tz: "Asia/Tokyo", label: "Tokyo", sub: "Japan" },
    { name: "Pakistan, Islamabad", tz: "Asia/Karachi", label: "Islamabad", sub: "Pakistan Standard Time" },
    { name: "Saudi Arabia, Riyadh", tz: "Asia/Riyadh", label: "Riyadh", sub: "Saudi Arabia, Makkah Time" },

];


export default function WorldTimeZone() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<typeof cityDatabase>([]);
    const [selectedZones, setSelectedZones] = useState<typeof cityDatabase>([
        { name: "India, Mumbai", tz: "Asia/Kolkata", label: "Mumbai", sub: "India Standard Time" },
        { name: "United Kingdom, London", tz: "Europe/London", label: "London", sub: "United Kingdom, England" },
        { name: "Russia, Moscow", tz: "Europe/Moscow", label: "Moscow", sub: "Russia" },
    ]);

    const [activeHour, setActiveHour] = useState<number>(new Date().getHours());
    const [baseDate, setBaseDate] = useState<string>("");
    const [liveTimes, setLiveTimes] = useState<{ [key: string]: { time: string; date: string } }>({});

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setBaseDate(today);
    }, []);

    // live time and date updater
    useEffect(() => {
        const updateTimes = () => {
            const now = new Date();
            const updated: typeof liveTimes = {};

            selectedZones.forEach((zone) => {
                const timeFormatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: zone.tz,
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });
                const dateFormatter = new Intl.DateTimeFormat("en-US", {
                    timeZone: zone.tz,
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                });

                const rawTime = timeFormatter.format(now);
                const formattedTime = rawTime.replace(" AM", "a").replace(" PM", "p");

                updated[zone.tz] = {
                    time: formattedTime,
                    date: dateFormatter.format(now),
                };
            });

            setLiveTimes(updated);
        };

        updateTimes();
        const interval = setInterval(updateTimes, 1000);
        return () => clearInterval(interval);
    }, [selectedZones]);

    // search filter
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }
        const filtered = cityDatabase.filter((city) =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchQuery]);

    const getLocalOffset = (tzId: string) => {
        try {
            const now = new Date();
            const localTime = new Date(now.toLocaleString("en-US", { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
            const targetTime = new Date(now.toLocaleString("en-US", { timeZone: tzId }));
            const diffMs = targetTime.getTime() - localTime.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours === 0) return "✈";
            return diffHours > 0 ? `+${diffHours.toFixed(1).replace(".0", "")}` : `${diffHours.toFixed(1).replace(".0", "")}`;
        } catch (e) {
            return "";
        }
    };

    const addZone = (city: typeof cityDatabase[0]) => {
        if (!selectedZones.find((z) => z.tz === city.tz)) {
            setSelectedZones([...selectedZones, city]);
        }
        setSearchQuery("");
    };

    const removeZone = (tz: string) => {
        setSelectedZones(selectedZones.filter((z) => z.tz !== tz));
    };

    const getGridHourData = (tzId: string, hourIndex: number) => {
        if (!baseDate) return { timeNum: "", amPm: "", isPm: false, isNextDay: false, dateLabel: "" };

        const date = new Date(`${baseDate}T00:00:00`);
        date.setHours(hourIndex);

        const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: tzId,
            hour: "numeric",
            hour12: true,
            day: "numeric",
        });

        const parts = formatter.formatToParts(date);
        const hourNum = parts.find((p) => p.type === "hour")?.value || "";
        const amPm = parts.find((p) => p.type === "dayPeriod")?.value.toLowerCase() || "";
        const formattedDay = parts.find((p) => p.type === "day")?.value || "";

        const baseDay = new Date(`${baseDate}T00:00:00`).getDate().toString();
        const isNextDay = formattedDay !== baseDay;

        const monthFormatter = new Intl.DateTimeFormat("en-US", {
            timeZone: tzId,
            month: "short",
            day: "numeric",
        });

        return {
            timeNum: hourNum,
            amPm: amPm,
            isPm: amPm === "pm",
            isNextDay,
            dateLabel: monthFormatter.format(date),
        };
    };

    return (
        <div className="min-h-screen bg-[#f4f5f7] text-slate-800 p-3 sm:p-6 md:p-8 flex flex-col font-sans">

            {/* Back Button */}
            <div className="mb-4">
                <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-600 bg-white hover:bg-slate-100 rounded-xl shadow-sm border border-slate-200 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Dashboard
                </Link>
            </div>

            {/* Main Board Container */}
            <div className="w-full mx-auto bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-md relative">

                {/* Top Header Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pb-5 border-b border-slate-200 relative z-30">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 text-lg">➕</span>
                        <input
                            type="text"
                            placeholder="Place, timezone or country"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-300 text-slate-800 pl-10 pr-4 py-2 rounded-lg text-base font-medium focus:outline-none focus:border-blue-500 shadow-inner"
                        />

                        {/* Dropdown Menu */}
                        {searchResults.length > 0 && (
                            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto z-50">
                                {searchResults.map((city, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => addZone(city)}
                                        className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors text-base border-b border-slate-100 last:border-0"
                                    >
                                        <div>
                                            <span className="font-bold text-slate-800">{city.label}</span>
                                            <span className="text-xs text-slate-500 ml-2">{city.sub}</span>
                                        </div>
                                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded">Add</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input
                        type="date"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                        className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-base font-bold cursor-pointer"
                    />
                </div>

                {/* 24-Hour Interactive Grid Rows */}
                <div className="mt-4 space-y-px overflow-x-auto pb-4 relative">
                    {selectedZones.map((zone, zoneIdx) => {
                        const liveData = liveTimes[zone.tz] || { time: "--:--", date: "---" };

                        return (
                            <div key={zoneIdx} className="flex items-center min-w-[980px] bg-white border-b border-slate-100 py-3 relative group">

                                {/* Left Area: Time offset, City Name, Sub Title & Live Time Clock */}

                                <div className="w-72 flex-shrink-0 pr-4 flex items-center justify-between relative z-10 bg-white border-r border-slate-200">

                                    {/* Left Side: Delete Icon + Offset + City Names */}
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        {selectedZones.length > 1 && (
                                            <button
                                                onClick={() => removeZone(zone.tz)}
                                                className="text-slate-300 hover:text-red-500 transition-colors text-sm pr-1 cursor-pointer"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        <span className="text-xs font-bold text-slate-400 w-10 flex-shrink-0 text-left">
                                            {getLocalOffset(zone.tz)}
                                        </span>

                                        <div className="min-w-0">
                                            <h3 className="font-extrabold text-slate-800 text-lg tracking-tight leading-tight truncate">
                                                {zone.label}
                                            </h3>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">
                                                {zone.sub}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side: Perfectly Aligned Fixed-Width Live Clock Column */}
                                    <div className="w-24 text-right flex-shrink-0 flex flex-col justify-center select-none">
                                        <div className="font-black text-slate-800 text-lg tracking-tight leading-none">
                                            {liveData.time}
                                        </div>
                                        <div className="text-[11px] font-bold text-slate-400 mt-1 whitespace-nowrap leading-none">
                                            {liveData.date}
                                        </div>
                                    </div>

                                </div>


                                {/* Right Area: 24-Hour Row Grid Blocks */}
                                <div className="flex-1 grid grid-cols-24 gap-px bg-slate-200 border border-slate-200 rounded overflow-hidden ml-4">
                                    {Array.from({ length: 24 }).map((_, hourIdx) => {
                                        const { timeNum, amPm, isPm, isNextDay, dateLabel } = getGridHourData(zone.tz, hourIdx);
                                        const isColumnActive = activeHour === hourIdx;

                                        return (
                                            <div
                                                key={hourIdx}
                                                onClick={() => setActiveHour(hourIdx)}
                                                className={`text-center py-2.5 select-none cursor-pointer transition-all relative flex flex-col justify-center min-h-[52px] ${isColumnActive
                                                    ? "bg-[#e2ebf8] text-blue-900 z-10 font-bold"
                                                    : isNextDay
                                                        ? "bg-blue-50/70 text-blue-700 font-semibold"
                                                        : isPm
                                                            ? "bg-slate-50 text-slate-700 hover:bg-slate-100"
                                                            : "bg-[#fcfdfe] text-slate-500 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {/* Hour number display (font sized up) */}
                                                <div className="text-base font-bold tracking-tight">
                                                    {isNextDay && timeNum === "12" ? (
                                                        <span className="text-[10px] font-black uppercase text-blue-600 block leading-none mb-0.5">{dateLabel}</span>
                                                    ) : (
                                                        timeNum
                                                    )}
                                                </div>

                                                {/* am/pm indicator tag */}
                                                <div className="text-[10px] font-semibold opacity-60 leading-none mt-0.5">
                                                    {isNextDay && timeNum === "12" ? "" : amPm}
                                                </div>

                                                {/* World Time Buddy Highlight Outline Box for selected active hour */}
                                                {isColumnActive && (
                                                    <div className="absolute top-0 bottom-0 left-0 right-0 border-[2.5px] border-slate-800 pointer-events-none z-20" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
