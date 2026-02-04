const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
            <p className="text-white/70 text-sm mb-4">{message || 'An unexpected error occurred'}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-secondary">
                    <span className="mr-2">🔄</span> Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
