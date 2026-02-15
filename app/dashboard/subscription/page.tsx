'use client'

import { CreditCard, Check, Rocket, Sparkles, Crown } from 'lucide-react'

const PLANS = [
    {
        name: 'Starter',
        price: '$0',
        period: '/mo',
        description: 'Perfect for getting started with mentoring',
        features: ['Up to 5 mentees', 'Basic scheduling', 'Standard support', 'Profile listing'],
        highlighted: false,
        cta: 'Current Plan',
    },
    {
        name: 'Professional',
        price: '$29',
        period: '/mo',
        description: 'For dedicated mentors who want to grow',
        features: ['Unlimited mentees', 'Advanced scheduling', 'Priority support', 'Featured listing', 'Analytics dashboard', 'Custom branding'],
        highlighted: true,
        cta: 'Coming Soon',
    },
    {
        name: 'Enterprise',
        price: '$79',
        period: '/mo',
        description: 'For organizations and premium mentors',
        features: ['Everything in Pro', 'Team management', 'API access', 'White-label options', 'Dedicated account manager', 'Custom integrations'],
        highlighted: false,
        cta: 'Coming Soon',
    },
]

export default function SubscriptionPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Coming soon banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-500/20 p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                    <Rocket className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-300">Subscription plans are coming soon</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">This is a preview of upcoming plans. Pricing and features may change before launch.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Preview</span>
                </div>
            </div>

            {/* Founding mentor note */}
            <div className="bg-gradient-to-br from-indigo-50 dark:from-indigo-950/40 to-gray-50 dark:to-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-500/20 p-5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                    <Crown className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Founding Mentor Benefit</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                        As a founding mentor, you&apos;ll receive special early-adopter pricing and
                        exclusive features not available to regular users. Details will be announced before launch.
                    </p>
                </div>
            </div>

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((plan) => (
                    <div
                        key={plan.name}
                        className={`relative rounded-xl border p-5 transition-all ${plan.highlighted
                            ? 'bg-gradient-to-b from-indigo-50 dark:from-indigo-950/40 to-white dark:to-slate-900/80 border-indigo-300 dark:border-indigo-500/30 shadow-lg shadow-indigo-500/5'
                            : 'bg-gray-50 dark:bg-slate-900/60 border-gray-200 dark:border-slate-800 opacity-60'
                            }`}
                    >
                        {plan.highlighted && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Recommended
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
                                    <Check className={`h-3.5 w-3.5 shrink-0 ${plan.highlighted ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-slate-600'}`} />
                                    <span className={`text-xs ${plan.highlighted ? 'text-gray-600 dark:text-slate-300' : 'text-gray-400 dark:text-slate-500'}`}>
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <button
                            disabled
                            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors cursor-not-allowed ${plan.highlighted
                                ? 'bg-indigo-100 dark:bg-indigo-600/30 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                                : 'bg-gray-100 dark:bg-slate-800/60 text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700/30'
                                }`}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>

            {/* FAQ area */}
            <div className="bg-gray-100 dark:bg-slate-800/30 rounded-xl p-4 border border-gray-200 dark:border-slate-700/30 text-center">
                <p className="text-xs text-gray-500 dark:text-slate-500">
                    💳 All plans include secure payment processing, no hidden fees, and the ability to cancel anytime. Questions? <a href="/contact" className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 underline">Contact us</a>.
                </p>
            </div>
        </div>
    )
}
