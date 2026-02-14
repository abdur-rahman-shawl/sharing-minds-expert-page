'use client'

import { BarChart3, Users, CalendarDays, Clock, TrendingUp, Eye, Rocket, Sparkles } from 'lucide-react'

const WEEKLY_DATA = [
    { day: 'Mon', views: 0, height: 25 },
    { day: 'Tue', views: 0, height: 40 },
    { day: 'Wed', views: 0, height: 35 },
    { day: 'Thu', views: 0, height: 55 },
    { day: 'Fri', views: 0, height: 45 },
    { day: 'Sat', views: 0, height: 20 },
    { day: 'Sun', views: 0, height: 15 },
]

export default function AnalyticsPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Coming soon banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-500/20 p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                    <Rocket className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-amber-300">Analytics is coming soon</p>
                    <p className="text-xs text-slate-400 mt-0.5">This is a preview of your analytics dashboard. All data shown is placeholder.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Preview</span>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard icon={Eye} label="Profile Views" value="0" trend="+0%" color="text-blue-400" />
                <MetricCard icon={Users} label="Mentee Inquiries" value="0" trend="+0%" color="text-emerald-400" />
                <MetricCard icon={CalendarDays} label="Sessions Done" value="0" trend="+0%" color="text-purple-400" />
                <MetricCard icon={Clock} label="Hours Mentored" value="0h" trend="+0%" color="text-amber-400" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Profile views chart */}
                <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-sm font-semibold text-slate-300">Profile Views</h3>
                        <span className="text-[10px] text-slate-600 px-2 py-0.5 bg-slate-800 rounded-md">This Week</span>
                    </div>
                    <div className="flex items-end gap-3 h-32 px-2">
                        {WEEKLY_DATA.map((item) => (
                            <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5">
                                <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-blue-600/25 to-blue-400/8 border border-blue-500/10 opacity-40"
                                    style={{ height: `${item.height}%` }}
                                />
                                <span className="text-[9px] text-slate-600">{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Engagement donut placeholder */}
                <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                    <h3 className="text-sm font-semibold text-slate-300 mb-5">Engagement Breakdown</h3>
                    <div className="flex items-center justify-center h-32">
                        <div className="relative">
                            <svg className="h-28 w-28" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" strokeWidth="12" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="12"
                                    strokeDasharray="60 191" strokeDashoffset="0" strokeLinecap="round" opacity="0.3" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#475569" strokeWidth="12"
                                    strokeDasharray="40 211" strokeDashoffset="-60" strokeLinecap="round" opacity="0.2" />
                                <circle cx="50" cy="50" r="40" fill="none" stroke="#64748b" strokeWidth="12"
                                    strokeDasharray="30 221" strokeDashoffset="-100" strokeLinecap="round" opacity="0.15" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-lg font-bold text-slate-600">0</p>
                                    <p className="text-[9px] text-slate-600">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-3">
                        <Legend color="bg-slate-500/30" label="Sessions" />
                        <Legend color="bg-slate-600/30" label="Messages" />
                        <Legend color="bg-slate-700/30" label="Content" />
                    </div>
                </div>
            </div>

            {/* Top skills */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Top Skills by Demand</h3>
                <div className="space-y-3">
                    {['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4'].map((skill, i) => (
                        <div key={skill} className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 w-16">{skill}</span>
                            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600/20 rounded-full"
                                    style={{ width: `${[45, 35, 25, 15][i]}%` }}
                                />
                            </div>
                            <span className="text-[10px] text-slate-600 w-6 text-right">0</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 text-center">
                <p className="text-xs text-slate-500">
                    📊 AI-powered analytics will help you understand your mentoring impact, optimize your schedule, and grow your mentee base.
                </p>
            </div>
        </div>
    )
}

function MetricCard({ icon: Icon, label, value, trend, color }: {
    icon: React.ElementType; label: string; value: string; trend: string; color: string
}) {
    return (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-[10px] text-slate-600 flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />{trend}
                </span>
            </div>
            <p className="text-xl font-bold text-slate-500">{value}</p>
            <p className="text-[11px] text-slate-500">{label}</p>
        </div>
    )
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-[10px] text-slate-600">{label}</span>
        </div>
    )
}
