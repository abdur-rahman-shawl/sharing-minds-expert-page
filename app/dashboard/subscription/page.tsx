'use client'

import { Check, Sparkles, Crown } from 'lucide-react'

// Static plan data kept only for the blurred backdrop
const PLANS = [
    {
        name: 'Starter',
        price: '$0',
        period: '/mo',
        description: 'Perfect for getting started with mentoring',
        features: ['Up to 5 mentees', 'Basic scheduling', 'Standard support', 'Profile listing'],
        highlighted: false,
    },
    {
        name: 'Professional',
        price: '$29',
        period: '/mo',
        description: 'For dedicated mentors who want to grow',
        features: ['Unlimited mentees', 'Advanced scheduling', 'Priority support', 'Featured listing', 'Analytics dashboard', 'Custom branding'],
        highlighted: true,
        badge: 'Recommended',
    },
    {
        name: 'Enterprise',
        price: '$79',
        period: '/mo',
        description: 'For organizations and premium mentors',
        features: ['Everything in Pro', 'Team management', 'API access', 'White-label options', 'Dedicated account manager', 'Custom integrations'],
        highlighted: false,
    },
]

export default function SubscriptionPage() {
    return (
        <div className="relative p-6 min-h-[calc(100vh-6rem)] overflow-hidden">

            {/* Blurred backdrop — real plan cards, non-interactive */}
            <div
                className="select-none pointer-events-none"
                style={{ filter: 'blur(6px)', opacity: 0.55 }}
                aria-hidden="true"
            >
                {/* Founding mentor note */}
                <div className="mb-6 bg-gradient-to-br from-indigo-50 dark:from-indigo-950/40 to-gray-50 dark:to-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-500/20 p-5 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                        <Crown className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Founding Mentor Benefit</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                            As a founding mentor, you&apos;ll receive special early-adopter pricing and exclusive features not available to regular users.
                        </p>
                    </div>
                </div>

                {/* Plan cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-xl border p-5 ${plan.highlighted
                                ? 'bg-gradient-to-b from-indigo-50 dark:from-indigo-950/40 to-white dark:to-slate-900/80 border-indigo-300 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                                : 'bg-gray-50 dark:bg-slate-900/60 border-gray-200 dark:border-slate-800'
                                }`}
                        >
                            {'badge' in plan && plan.badge && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                    {plan.badge}
                                </div>
                            )}
                            <h3 className={`text-lg font-bold ${plan.highlighted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-400'}`}>
                                {plan.name}
                            </h3>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{plan.description}</p>
                            <div className="mt-4 mb-5">
                                <span className={`text-3xl font-bold ${plan.highlighted ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>
                                    {plan.price}
                                </span>
                                <span className="text-sm text-gray-400 dark:text-slate-500">{plan.period}</span>
                            </div>
                            <div className="space-y-2 mb-5">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-2">
                                        <Check className={`h-3.5 w-3.5 shrink-0 ${plan.highlighted ? 'text-indigo-500' : 'text-gray-400'}`} />
                                        <span className={`text-xs ${plan.highlighted ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className={`w-full py-2 rounded-lg text-sm font-medium text-center ${plan.highlighted
                                ? 'bg-indigo-100 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                                : 'bg-gray-100 dark:bg-slate-800/60 text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700/30'
                                }`}>
                                {plan.highlighted ? 'Get Started' : 'Choose Plan'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-5 bg-gray-100 dark:bg-slate-800/30 rounded-xl p-4 border border-gray-200 dark:border-slate-700/30 text-center">
                    <p className="text-xs text-gray-500 dark:text-slate-500">
                        💳 All plans include secure payment processing, no hidden fees, and the ability to cancel anytime.
                    </p>
                </div>
            </div>

            {/* Frosted glass overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-full max-w-sm mx-auto">
                    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/60 rounded-2xl shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-500/5 p-8 text-center space-y-5">

                        {/* Pulsing icon */}
                        <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                            <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-3.5 shadow-lg shadow-indigo-500/30">
                                <Sparkles className="h-7 w-7 text-white" />
                            </div>
                        </div>

                        {/* Headline */}
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Subscription Plans
                                <br />
                                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                    Coming Soon
                                </span>
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                                We&apos;re putting the finishing touches on our plans. As a founding mentor, you&apos;ll receive exclusive early-adopter pricing.
                            </p>
                        </div>

                        {/* Founding mentor badge */}
                        <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-full px-3 py-1">
                            <Crown className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                Your founding mentor benefits are secured
                            </span>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}
