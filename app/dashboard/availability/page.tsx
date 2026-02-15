'use client'

import { Clock } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
]

export default function AvailabilityPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-emerald-400" />
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Set Your Availability</h2>
                    <p className="text-xs text-gray-400 dark:text-slate-500">Define when mentees can book sessions with you</p>
                </div>
            </div>

            {/* Weekly grid */}
            <div className="bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-slate-800">
                                <th className="p-3 text-left text-xs font-medium text-gray-400 dark:text-slate-500 w-[100px]">Time</th>
                                {DAYS.map((day) => (
                                    <th key={day} className="p-3 text-center text-xs font-medium text-gray-500 dark:text-slate-400">
                                        {day.slice(0, 3)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TIME_SLOTS.map((time) => (
                                <tr key={time} className="border-b border-gray-100 dark:border-slate-800/40 last:border-0">
                                    <td className="p-2 text-[11px] text-gray-400 dark:text-slate-500 font-mono">{time}</td>
                                    {DAYS.map((day) => (
                                        <td key={day} className="p-1.5">
                                            <div className="h-8 rounded-md border border-gray-200 dark:border-slate-800/60 bg-gray-100 dark:bg-slate-800/20 hover:bg-gray-200 dark:hover:bg-slate-800/40 hover:border-gray-300 dark:hover:border-slate-700 transition-colors cursor-not-allowed" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info */}
            <div className="bg-gray-100 dark:bg-slate-800/30 rounded-xl p-4 border border-gray-200 dark:border-slate-700/30">
                <p className="text-xs text-gray-500 dark:text-slate-500 text-center">
                    ⏰ Availability settings will be configurable once the platform launches. Mentees will use this to book time slots with you.
                </p>
            </div>
        </div>
    )
}
