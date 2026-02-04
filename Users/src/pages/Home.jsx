import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeatMeter from '../components/HeatMeter';
import { weatherService } from '../api/services';

const Home = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Get user location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log('Geolocation error:', error.message);
                }
            );
        }
    }, []);

    const fetchWeatherData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await weatherService.getWBGT(
                userLocation?.latitude,
                userLocation?.longitude
            );
            setWeatherData(data);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWeatherData();
        const interval = setInterval(fetchWeatherData, 30000);
        return () => clearInterval(interval);
    }, [userLocation]);

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Current Heat Conditions
                </h2>
                <p className="text-white/50 text-sm">
                    Real-time WBGT monitoring for your safety
                </p>
            </div>

            {/* Heat Meter Card */}
            <div className="glass-card-elevated p-6 mb-6">
                <HeatMeter
                    wbgt={weatherData?.wbgt}
                    status={weatherData?.status}
                    isLoading={isLoading}
                />

                {/* Last Updated */}
                {lastUpdated && (
                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                        <span className="text-white/40 text-xs">
                            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                            onClick={fetchWeatherData}
                            className="text-sky-400 hover:text-sky-300 text-xs font-medium flex items-center gap-1 transition-colors"
                            disabled={isLoading}
                        >
                            <span className={isLoading ? 'animate-spin' : ''}>🔄</span>
                            Refresh
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
                {/* Triage Card */}
                <Link to="/triage" className="block group">
                    <div className="glass-card-interactive p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-xl shadow-lg shadow-sky-500/20 shrink-0">
                                🩺
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                                    Health Assessment
                                </h3>
                                <p className="text-white/50 text-sm truncate">
                                    Quick symptom check for heat illness
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white/70 group-hover:bg-white/10 transition-all">
                                →
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Map Card */}
                <Link to="/map" className="block group">
                    <div className="glass-card-interactive p-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 shrink-0">
                                🗺️
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                                    Find Resources
                                </h3>
                                <p className="text-white/50 text-sm truncate">
                                    Cooling centers, hospitals & water
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white/70 group-hover:bg-white/10 transition-all">
                                →
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Safety Tips */}
            <div className="glass-card p-4">
                <div className="section-header mb-3">
                    <div className="section-header-icon bg-amber-500/20">
                        <span>💡</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                        Stay Safe
                    </h4>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {[
                        { icon: '💧', text: 'Stay hydrated', desc: 'Drink often' },
                        { icon: '🏠', text: 'Seek shade', desc: 'Rest indoors' },
                        { icon: '👕', text: 'Light clothes', desc: 'Loose & light' },
                        { icon: '⏰', text: 'Avoid 12-4pm', desc: 'Peak heat hours' },
                    ].map((tip, index) => (
                        <div
                            key={index}
                            className="bg-white/5 rounded-lg p-3 flex items-center gap-3"
                        >
                            <span className="text-lg">{tip.icon}</span>
                            <div>
                                <p className="text-white/90 text-sm font-medium leading-tight">{tip.text}</p>
                                <p className="text-white/40 text-xs">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
