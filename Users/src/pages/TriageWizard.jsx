import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { triageService } from '../api/services';

const TriageWizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [symptoms, setSymptoms] = useState({
        dizziness: false,
        cramps: false,
        confusion: false,
        fever: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { key: 'dizziness', icon: '😵', title: 'Dizziness', desc: 'Feeling lightheaded or unsteady' },
        { key: 'cramps', icon: '💪', title: 'Muscle Cramps', desc: 'Painful spasms in legs or abdomen' },
        { key: 'confusion', icon: '🧠', title: 'Confusion', desc: 'Difficulty thinking clearly' },
        { key: 'fever', icon: '🌡️', title: 'High Fever', desc: 'Body temperature above 103°F' },
    ];

    const progress = ((currentStep + 1) / steps.length) * 100;
    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;

    const handleAnswer = (hasSymptom) => {
        setSymptoms((prev) => ({ ...prev, [currentStepData.key]: hasSymptom }));

        if (!isLastStep) {
            setTimeout(() => setCurrentStep((prev) => prev + 1), 200);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await triageService.submit(symptoms);
            navigate('/result', { state: { result, symptoms } });
        } catch (error) {
            console.error('Triage submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" text="Analyzing symptoms..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">
                    Health Check
                </h2>
                <p className="text-white/50 text-sm">
                    Answer {steps.length} quick questions
                </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-white/50 mb-2">
                    <span className="font-medium">Question {currentStep + 1}/{steps.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {/* Question Card */}
            <div className="glass-card-elevated p-6 mb-6">
                {/* Symptom Icon & Title */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
                        {currentStepData.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                        {currentStepData.title}
                    </h3>
                    <p className="text-white/50 text-sm">
                        {currentStepData.desc}
                    </p>
                </div>

                {/* Question */}
                <p className="text-center text-white/80 mb-6 text-lg">
                    Are you experiencing this symptom?
                </p>

                {/* Answer Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleAnswer(false)}
                        className="py-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 font-semibold 
                       hover:bg-green-500/25 active:scale-[0.98] transition-all touch-target"
                    >
                        <span className="text-xl mb-1 block">✓</span>
                        No, I'm Fine
                    </button>
                    <button
                        onClick={() => handleAnswer(true)}
                        className="py-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 font-semibold 
                       hover:bg-red-500/25 active:scale-[0.98] transition-all touch-target"
                    >
                        <span className="text-xl mb-1 block">!</span>
                        Yes, I Have This
                    </button>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`px-5 py-3 rounded-xl font-medium transition-all touch-target ${currentStep === 0
                            ? 'bg-white/5 text-white/30 cursor-not-allowed'
                            : 'bg-white/10 text-white hover:bg-white/15 active:scale-[0.98]'
                        }`}
                >
                    ← Back
                </button>

                {isLastStep && (
                    <button onClick={handleSubmit} className="flex-1 btn-primary">
                        Get Results
                    </button>
                )}
            </div>

            {/* Selected Symptoms Summary */}
            {Object.values(symptoms).some((v) => v) && (
                <div className="mt-6 glass-card p-4">
                    <p className="text-white/50 text-xs uppercase tracking-wide font-medium mb-2">
                        Reported Symptoms
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(symptoms)
                            .filter(([, value]) => value)
                            .map(([key]) => {
                                const step = steps.find(s => s.key === key);
                                return (
                                    <span
                                        key={key}
                                        className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 text-xs font-medium flex items-center gap-1"
                                    >
                                        <span>{step?.icon}</span>
                                        {step?.title}
                                    </span>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Step Indicators */}
            <div className="mt-6 flex justify-center gap-2">
                {steps.map((step, index) => (
                    <button
                        key={step.key}
                        onClick={() => setCurrentStep(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentStep
                                ? 'bg-sky-400 w-6'
                                : index < currentStep
                                    ? 'bg-white/40'
                                    : 'bg-white/15'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TriageWizard;
