'use client'

import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    subtitle?: string
    accentColor?: string
}

export function StatCard({ label, value, icon: Icon, subtitle, accentColor = 'text-indigo-400' }: StatCardProps) {
    return (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 hover:border-slate-700 transition-colors duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-slate-800/80`}>
                    <Icon className={`h-4 w-4 ${accentColor}`} />
                </div>
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
            {subtitle && (
                <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
            )}
        </div>
    )
}
