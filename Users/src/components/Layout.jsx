import { NavLink, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const navItems = [
        { path: '/', icon: '🌡️', label: 'Home' },
        { path: '/triage', icon: '🩺', label: 'Triage' },
        { path: '/map', icon: '🗺️', label: 'Map' },
    ];

    return (
        <div className="flex flex-col min-h-screen min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-50 safe-area-top">
                <div className="glass-card rounded-none border-0 border-b border-white/10">
                    <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="text-xl">🔥</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold gradient-text leading-tight">Therma-Triage</h1>
                                <p className="text-[0.65rem] text-white/50 uppercase tracking-wider font-medium">
                                    Heatwave Emergency
                                </p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/60 hover:text-white hover:bg-white/10'
                                        }`
                                    }
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-5 pb-28 md:pb-8">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
                <div className="glass-card rounded-none border-0 border-t border-white/10">
                    <div className="flex justify-around py-2 px-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex flex-col items-center py-2 px-5 rounded-xl transition-all duration-200 touch-target ${isActive
                                        ? 'text-sky-400 bg-sky-500/10'
                                        : 'text-white/50 active:text-white active:bg-white/10'
                                    }`
                                }
                            >
                                <span className="text-[1.375rem] mb-0.5">{item.icon}</span>
                                <span className="text-[0.625rem] font-semibold uppercase tracking-wide">
                                    {item.label}
                                </span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
