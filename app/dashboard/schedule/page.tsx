'use client'

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

export default function SchedulePage() {
    const [currentDate] = useState(new Date())

    const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

    // Get the week dates
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        return date
    })

    const isToday = (date: Date) => {
        const today = new Date()
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
    }

    return (
        <div className="p-6 space-y-4">
            {/* Calendar header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">{monthName}</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" disabled>
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg">
                        Today
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors" disabled>
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Week view */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
                {/* Day header row */}
                <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-800">
                    <div className="p-2" />
                    {weekDates.map((date, i) => (
                        <div
                            key={i}
                            className={`p-2 text-center border-l border-slate-800 ${isToday(date) ? 'bg-indigo-600/10' : ''}`}
                        >
                            <p className="text-[10px] text-slate-500 uppercase">{DAYS[i]}</p>
                            <p className={`text-sm font-semibold mt-0.5 ${isToday(date)
                                ? 'text-indigo-400 bg-indigo-500/20 rounded-full w-7 h-7 flex items-center justify-center mx-auto'
                                : 'text-slate-300'
                                }`}>
                                {date.getDate()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Time grid */}
                <div className="max-h-[500px] overflow-y-auto">
                    {HOURS.map((hour) => (
                        <div key={hour} className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-800/50 last:border-0">
                            <div className="p-2 text-[10px] text-slate-500 text-right pr-3">
                                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                            </div>
                            {weekDates.map((_, i) => (
                                <div
                                    key={i}
                                    className={`min-h-[48px] border-l border-slate-800/50 ${isToday(weekDates[i]) ? 'bg-indigo-600/5' : ''}`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty state overlay */}
            <div className="text-center py-4">
                <p className="text-slate-500 text-sm">No sessions scheduled yet</p>
                <p className="text-slate-600 text-xs mt-1">Your upcoming and past sessions will appear on this calendar</p>
            </div>
        </div>
    )
}
