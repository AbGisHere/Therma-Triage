import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, symptoms } = location.state || {};

    useEffect(() => {
        if (!result) {
            navigate('/triage');
        }
    }, [result, navigate]);

    if (!result) return null;

    const isCritical = result.severity === 'critical';

    const handleNavigate = () => {
        if (result.hospital) {
            const address = encodeURIComponent(result.hospital.address || result.hospital.name);
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
        }
    };

    return (
        <div className="flex flex-col max-w-md mx-auto">
            {/* Result Header */}
            <div
                className={`text-center p-6 rounded-2xl mb-6 ${isCritical
                        ? 'bg-gradient-to-br from-red-500/25 to-orange-500/15 border-2 border-red-500/40'
                        : 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30'
                    }`}
            >
                <div
                    className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl ${isCritical
                            ? 'bg-red-500/20 animate-pulse'
                            : 'bg-green-500/20'
                        }`}
                >
                    {isCritical ? '🚨' : '✓'}
                </div>

                <h2
                    className={`text-xl font-bold mb-2 ${isCritical ? 'text-red-400' : 'text-green-400'
                        }`}
                >
                    {isCritical ? 'Seek Medical Help' : 'Mild Symptoms'}
                </h2>

                <p className="text-white/70 text-sm leading-relaxed">
                    {result.recommendation}
                </p>
            </div>

            {/* Critical: Hospital Card */}
            {isCritical && result.hospital && (
                <div className="glass-card-elevated p-5 mb-4 border-2 border-red-500/30">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-red-500/20 flex items-center justify-center text-xl">
                            🏥
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Nearest Hospital</h3>
                            <p className="text-white/50 text-xs">Emergency care available</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl mb-4">
                        <h4 className="font-semibold text-white mb-1">{result.hospital.name}</h4>
                        <p className="text-white/60 text-sm">{result.hospital.address}</p>
                        {result.hospital.available_beds && (
                            <p className="text-green-400 text-xs mt-2">
                                {result.hospital.available_beds} beds available
                            </p>
                        )}
                    </div>

                    <button onClick={handleNavigate} className="w-full btn-danger">
                        🧭 Navigate Now
                    </button>
                </div>
            )}

            {/* Mild: Cooling Shelters */}
            {!isCritical && result.shelters && result.shelters.length > 0 && (
                <div className="glass-card p-5 mb-4">
                    <div className="section-header mb-4">
                        <div className="section-header-icon bg-blue-500/20">
                            <span>❄️</span>
                        </div>
                        <h3 className="section-header-title">Cooling Shelters</h3>
                    </div>

                    <div className="space-y-2">
                        {result.shelters.slice(0, 3).map((shelter, index) => (
                            <div
                                key={shelter.id || index}
                                className="p-3 bg-white/5 rounded-xl flex items-center justify-between gap-3"
                            >
                                <div className="min-w-0">
                                    <h4 className="font-medium text-white text-sm truncate">{shelter.name}</h4>
                                    <p className="text-white/50 text-xs truncate">{shelter.address}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        window.open(
                                            `https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`,
                                            '_blank'
                                        );
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-400 text-xs font-medium shrink-0"
                                >
                                    Go
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Self-Care Tips (Mild only) */}
            {!isCritical && (
                <div className="glass-card p-5 mb-4">
                    <div className="section-header mb-3">
                        <div className="section-header-icon bg-amber-500/20">
                            <span>💡</span>
                        </div>
                        <h3 className="section-header-title">Self-Care Tips</h3>
                    </div>

                    <ul className="space-y-2">
                        {[
                            { icon: '💧', text: 'Drink water frequently' },
                            { icon: '🏠', text: 'Move to a cool place' },
                            { icon: '🧊', text: 'Apply cool cloths to skin' },
                            { icon: '⏰', text: 'Rest and monitor symptoms' },
                        ].map((tip, index) => (
                            <li key={index} className="flex items-center gap-3 text-white/80 text-sm">
                                <span>{tip.icon}</span>
                                <span>{tip.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Warning Signs */}
            <div className="glass-card p-5 mb-6 border border-yellow-500/20">
                <div className="section-header mb-3">
                    <div className="section-header-icon bg-yellow-500/20">
                        <span>⚠️</span>
                    </div>
                    <h3 className="text-yellow-400 font-semibold text-sm">Warning Signs</h3>
                </div>
                <p className="text-white/60 text-xs mb-2">Seek help immediately if you have:</p>
                <ul className="space-y-1 text-white/70 text-xs">
                    <li>• Temperature above 103°F (39.4°C)</li>
                    <li>• Confusion or slurred speech</li>
                    <li>• Loss of consciousness</li>
                    <li>• Rapid, strong pulse</li>
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-4">
                <Link to="/triage" className="flex-1 btn-secondary text-center">
                    New Check
                </Link>
                <Link to="/map" className="flex-1 btn-primary text-center">
                    View Map
                </Link>
            </div>

            {/* Emergency Call */}
            <div className="text-center">
                <a
                    href="tel:911"
                    className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium"
                >
                    📞 Call Emergency (911)
                </a>
            </div>
        </div>
    );
};

export default ResultPage;
