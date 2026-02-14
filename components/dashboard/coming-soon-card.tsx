'use client'

import { LucideIcon, Rocket, Sparkles } from 'lucide-react'

interface ComingSoonCardProps {
    icon: LucideIcon
    title: string
    description: string
    teaser?: string
}

export function ComingSoonCard({ icon: Icon, title, description, teaser }: ComingSoonCardProps) {
    return (
        <div className="flex items-center justify-center p-6 min-h-[calc(100vh-3.5rem)]">
            <div className="w-full max-w-md text-center">
                {/* Glow */}
                <div className="relative inline-block mb-6">
                    <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-60" />
                    <div className="relative bg-slate-800/80 p-5 rounded-2xl border border-slate-700/50">
                        <Icon className="h-10 w-10 text-slate-400" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                    {description}
                </p>

                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30 mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Rocket className="h-4 w-4 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <p className="text-slate-500 text-xs">
                        This feature is being built and will be available when the platform launches.
                    </p>
                </div>

                {teaser && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-400">
                        <Sparkles className="h-3 w-3" />
                        <span>{teaser}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
