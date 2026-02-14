'use client'

import { DollarSign, TrendingUp, ArrowUpRight, Calendar, Wallet, Rocket, Sparkles } from 'lucide-react'

// Fake chart data for the visual preview
const MONTHLY_DATA = [
    { month: 'Jan', amount: 0, height: 12 },
    { month: 'Feb', amount: 0, height: 18 },
    { month: 'Mar', amount: 0, height: 28 },
    { month: 'Apr', amount: 0, height: 22 },
    { month: 'May', amount: 0, height: 38 },
    { month: 'Jun', amount: 0, height: 45 },
    { month: 'Jul', amount: 0, height: 52 },
    { month: 'Aug', amount: 0, height: 48 },
    { month: 'Sep', amount: 0, height: 60 },
    { month: 'Oct', amount: 0, height: 55 },
    { month: 'Nov', amount: 0, height: 68 },
    { month: 'Dec', amount: 0, height: 75 },
]

const RECENT_TRANSACTIONS = [
    { type: 'Session', mentee: '—', amount: '$0.00', date: '—', status: 'pending' },
    { type: 'Workshop', mentee: '—', amount: '$0.00', date: '—', status: 'pending' },
    { type: 'Session', mentee: '—', amount: '$0.00', date: '—', status: 'pending' },
    { type: 'Session', mentee: '—', amount: '$0.00', date: '—', status: 'pending' },
]

export default function EarningsPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Coming soon banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-500/20 p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                    <Rocket className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-amber-300">Earnings tracking is coming soon</p>
                    <p className="text-xs text-slate-400 mt-0.5">This is a preview of your future earnings dashboard. All data shown is placeholder.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Preview</span>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <EarningCard
                    label="Total Earnings"
                    value="$0.00"
                    icon={DollarSign}
                    trend="+0%"
                    color="text-emerald-400"
                    bgColor="bg-emerald-500/10"
                />
                <EarningCard
                    label="This Month"
                    value="$0.00"
                    icon={Calendar}
                    trend="+0%"
                    color="text-blue-400"
                    bgColor="bg-blue-500/10"
                />
                <EarningCard
                    label="Pending Payout"
                    value="$0.00"
                    icon={Wallet}
                    color="text-amber-400"
                    bgColor="bg-amber-500/10"
                />
                <EarningCard
                    label="Avg. per Session"
                    value="$0.00"
                    icon={TrendingUp}
                    color="text-purple-400"
                    bgColor="bg-purple-500/10"
                />
            </div>

            {/* Chart */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-300">Monthly Earnings</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Your projected earnings overview</p>
                    </div>
                    <div className="flex gap-1">
                        {['6M', '1Y', 'All'].map((period) => (
                            <button
                                key={period}
                                className={`px-2.5 py-1 text-[10px] rounded-md font-medium transition-colors ${period === '1Y'
                                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/20'
                                        : 'text-slate-500 hover:text-slate-400'
                                    }`}
                                disabled
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bar chart */}
                <div className="flex items-end gap-2 h-40 px-2">
                    {MONTHLY_DATA.map((item) => (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5">
                            <div
                                className="w-full rounded-t-md bg-gradient-to-t from-indigo-600/30 to-indigo-400/10 border border-indigo-500/10 opacity-40"
                                style={{ height: `${item.height}%` }}
                            />
                            <span className="text-[9px] text-slate-600">{item.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent transactions */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-300">Recent Transactions</h3>
                </div>
                <div className="divide-y divide-slate-800/60">
                    {RECENT_TRANSACTIONS.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-800/60 flex items-center justify-center">
                                    <DollarSign className="h-3.5 w-3.5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">{tx.type}</p>
                                    <p className="text-[11px] text-slate-600">{tx.mentee}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-500 font-mono">{tx.amount}</p>
                                <p className="text-[11px] text-slate-600">{tx.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-slate-800/20 text-center">
                    <p className="text-[11px] text-slate-600">Transaction history will appear here once sessions begin</p>
                </div>
            </div>

            {/* Payout info */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 text-center">
                <p className="text-xs text-slate-500">
                    💰 As a <span className="text-amber-400 font-medium">Founding Mentor</span>, you&apos;ll earn from 1-on-1 sessions, group workshops, and premium content. Payouts will be processed weekly via your preferred method.
                </p>
            </div>
        </div>
    )
}

function EarningCard({ label, value, icon: Icon, trend, color, bgColor }: {
    label: string
    value: string
    icon: React.ElementType
    trend?: string
    color: string
    bgColor: string
}) {
    return (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
                {trend && (
                    <span className="text-[10px] text-slate-600 flex items-center gap-0.5">
                        <ArrowUpRight className="h-3 w-3" />
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-xl font-bold text-slate-500 font-mono">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
    )
}
