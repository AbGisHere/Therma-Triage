import { useState, useEffect } from 'react';

const HeatMeter = ({ wbgt, status, isLoading }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        if (wbgt === null || wbgt === undefined) return;

        const duration = 1000;
        const start = animatedValue;
        const end = wbgt;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedValue(start + (end - start) * eased);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [wbgt]);

    const getColors = () => {
        switch (status) {
            case 'safe':
                return {
                    primary: '#22c55e',
                    glow: 'glow-safe',
                    gradient: 'from-green-400 to-emerald-500',
                    bg: 'bg-green-500/15',
                    text: 'text-green-400',
                };
            case 'caution':
                return {
                    primary: '#eab308',
                    glow: 'glow-caution',
                    gradient: 'from-yellow-400 to-orange-500',
                    bg: 'bg-yellow-500/15',
                    text: 'text-yellow-400',
                };
            case 'danger':
                return {
                    primary: '#ef4444',
                    glow: 'glow-danger',
                    gradient: 'from-red-400 to-rose-500',
                    bg: 'bg-red-500/15',
                    text: 'text-red-400',
                };
            default:
                return {
                    primary: '#64748b',
                    glow: '',
                    gradient: 'from-slate-400 to-slate-500',
                    bg: 'bg-slate-500/15',
                    text: 'text-slate-400',
                };
        }
    };

    const colors = getColors();

    const minWBGT = 15;
    const maxWBGT = 40;
    const normalizedValue = Math.min(Math.max((animatedValue - minWBGT) / (maxWBGT - minWBGT), 0), 1);
    const circumference = 2 * Math.PI * 100;
    const strokeDashoffset = circumference * (1 - normalizedValue * 0.75);

    const getStatusText = () => {
        switch (status) {
            case 'safe': return 'Safe Conditions';
            case 'caution': return 'Use Caution';
            case 'danger': return 'Extreme Danger';
            default: return 'Checking...';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'safe': return '✓';
            case 'caution': return '⚡';
            case 'danger': return '🔥';
            default: return '○';
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center py-4">
                <div className="relative w-48 h-48 mb-4">
                    <div className="absolute inset-0 rounded-full skeleton" />
                    <div className="absolute inset-6 rounded-full skeleton" />
                    <div className="absolute inset-12 rounded-full bg-white/5" />
                </div>
                <div className="h-4 w-32 skeleton mb-2" />
                <div className="h-3 w-48 skeleton" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            {/* Main Meter */}
            <div className={`relative w-48 h-48 md:w-56 md:h-56 ${colors.glow} mb-4`}>
                {/* SVG Gauge */}
                <svg
                    className="w-full h-full transform -rotate-135"
                    viewBox="0 0 240 240"
                >
                    {/* Background arc */}
                    <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={circumference * 0.75}
                        strokeDashoffset={0}
                    />

                    {/* Progress arc */}
                    <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="none"
                        stroke={`url(#gradient-${status})`}
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={circumference * 0.75}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-700 ease-out"
                    />

                    {/* Gradient definitions */}
                    <defs>
                        <linearGradient id="gradient-safe" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4ade80" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                        <linearGradient id="gradient-caution" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#facc15" />
                            <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                        <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        <linearGradient id="gradient-undefined" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#64748b" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline">
                        <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                            {animatedValue.toFixed(1)}
                        </span>
                        <span className="text-lg text-white/50 ml-0.5">°C</span>
                    </div>
                    <p className="text-white/40 text-xs mt-0.5 uppercase tracking-wide font-medium">
                        WBGT
                    </p>
                </div>
            </div>

            {/* Status Badge */}
            <div
                className={`px-4 py-2 rounded-full ${colors.bg} flex items-center gap-2 ${status === 'danger' ? 'animate-pulse' : ''
                    }`}
            >
                <span className="text-lg">{getStatusIcon()}</span>
                <span className={`font-semibold ${colors.text}`}>
                    {getStatusText()}
                </span>
            </div>

            {/* Info text */}
            <p className="mt-3 text-white/40 text-xs text-center max-w-[240px] leading-relaxed">
                {status === 'safe' && 'Outdoor activities are generally safe. Stay hydrated.'}
                {status === 'caution' && 'Take frequent breaks. Avoid strenuous activity.'}
                {status === 'danger' && 'Limit outdoor exposure. Seek shelter immediately.'}
            </p>
        </div>
    );
};

export default HeatMeter;
