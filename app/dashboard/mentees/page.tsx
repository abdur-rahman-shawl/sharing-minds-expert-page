'use client'

import { Users } from 'lucide-react'

export default function MenteesPage() {
    return (
        <div className="flex items-center justify-center p-6 min-h-[calc(100vh-5.5rem)]">
            <div className="w-full max-w-lg text-center">
                {/* Illustration area */}
                <div className="relative inline-block mb-8">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-2xl opacity-60" />
                    <div className="relative bg-gray-100 dark:bg-slate-800/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-700/40">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700/60 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700/60 flex items-center justify-center">
                                <Users className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700/60 flex items-center justify-center">
                                <Users className="h-5 w-5 text-purple-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-200 dark:bg-slate-700/60 rounded-full w-full" />
                            <div className="h-2 bg-gray-200 dark:bg-slate-700/60 rounded-full w-3/4 mx-auto" />
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Mentees</h2>
                <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-4 max-w-sm mx-auto">
                    Once the platform launches, your mentees will appear here. You&apos;ll be able to track progress, manage relationships, and communicate directly.
                </p>

                <div className="bg-gray-100 dark:bg-slate-800/40 rounded-xl p-3 border border-gray-200 dark:border-slate-700/30 inline-block">
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                        <span className="text-amber-500 dark:text-amber-400 font-medium">0</span> mentees · Launching soon
                    </p>
                </div>
            </div>
        </div>
    )
}
