const SymptomCard = ({ symptom, isSelected, onToggle }) => {
    const symptomConfig = {
        dizziness: {
            icon: '😵',
            title: 'Dizziness',
            description: 'Feeling lightheaded, unsteady, or faint',
        },
        cramps: {
            icon: '💪',
            title: 'Muscle Cramps',
            description: 'Painful muscle spasms, especially in legs or abdomen',
        },
        confusion: {
            icon: '🧠',
            title: 'Confusion',
            description: 'Difficulty thinking clearly, disorientation',
        },
        fever: {
            icon: '🌡️',
            title: 'High Fever',
            description: 'Body temperature above 103°F (39.4°C)',
        },
    };

    const config = symptomConfig[symptom] || {
        icon: '❓',
        title: symptom,
        description: '',
    };

    return (
        <button
            onClick={onToggle}
            className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 text-left
                  ${isSelected
                    ? 'bg-red-500/20 border-red-500/50 shadow-lg shadow-red-500/20'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-all duration-300
                      ${isSelected ? 'bg-red-500/30' : 'bg-white/10'}`}
                >
                    {config.icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-white">{config.title}</h3>
                        <div
                            className={`w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                          ${isSelected
                                    ? 'bg-red-500 border-red-500'
                                    : 'border-white/30'
                                }`}
                        >
                            {isSelected && <span className="text-white text-sm">✓</span>}
                        </div>
                    </div>
                    <p className="text-white/60 text-sm">{config.description}</p>
                </div>
            </div>
        </button>
    );
};

export default SymptomCard;
