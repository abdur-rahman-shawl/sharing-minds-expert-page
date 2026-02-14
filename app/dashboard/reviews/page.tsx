'use client'

import { Star, Rocket, Sparkles, ThumbsUp, MessageCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const PLACEHOLDER_REVIEWS = [
    { name: '—', initials: '?', rating: 0, date: '—', text: 'Review content will appear here once mentees start booking sessions with you.' },
    { name: '—', initials: '?', rating: 0, date: '—', text: 'Your mentees will be able to leave detailed feedback after each session.' },
    { name: '—', initials: '?', rating: 0, date: '—', text: 'Ratings help build your reputation and attract more mentees to your profile.' },
]

export default function ReviewsPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Coming soon banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-500/20 p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                    <Rocket className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-amber-300">Reviews are coming soon</p>
                    <p className="text-xs text-slate-400 mt-0.5">This is a preview of how your reviews will look. All data shown is placeholder.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Preview</span>
                </div>
            </div>

            {/* Rating summary */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Overall rating */}
                    <div className="text-center">
                        <p className="text-5xl font-bold text-slate-600">0.0</p>
                        <div className="flex items-center gap-0.5 mt-2 justify-center">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="h-4 w-4 text-slate-700" fill="currentColor" />
                            ))}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">0 reviews</p>
                    </div>

                    {/* Rating breakdown */}
                    <div className="flex-1 w-full space-y-1.5">
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-3">{stars}</span>
                                <Star className="h-3 w-3 text-slate-700" />
                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-700/40 rounded-full" style={{ width: '0%' }} />
                                </div>
                                <span className="text-[10px] text-slate-600 w-4 text-right">0</span>
                            </div>
                        ))}
                    </div>

                    {/* Quick stats */}
                    <div className="flex sm:flex-col gap-4">
                        <div className="text-center">
                            <div className="bg-slate-800/60 p-2 rounded-lg mx-auto w-fit mb-1">
                                <ThumbsUp className="h-4 w-4 text-slate-600" />
                            </div>
                            <p className="text-lg font-bold text-slate-600">0%</p>
                            <p className="text-[10px] text-slate-600">Satisfaction</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-slate-800/60 p-2 rounded-lg mx-auto w-fit mb-1">
                                <MessageCircle className="h-4 w-4 text-slate-600" />
                            </div>
                            <p className="text-lg font-bold text-slate-600">0</p>
                            <p className="text-[10px] text-slate-600">Responses</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review cards */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400">Recent Reviews</h3>
                {PLACEHOLDER_REVIEWS.map((review, i) => (
                    <div key={i} className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 opacity-50">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-slate-800 text-slate-600 text-xs">{review.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-slate-500">{review.name}</p>
                                    <p className="text-[10px] text-slate-600">{review.date}</p>
                                </div>
                                <div className="flex items-center gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="h-3 w-3 text-slate-700" fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{review.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 text-center">
                <p className="text-xs text-slate-500">
                    ⭐ Reviews help build trust and credibility. As a <span className="text-amber-400 font-medium">Founding Mentor</span>, your early reviews will be highlighted to future mentees.
                </p>
            </div>
        </div>
    )
}
