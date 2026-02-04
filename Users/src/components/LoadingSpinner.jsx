const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div
                    className={`${sizeClasses[size]} border-4 border-white/20 border-t-sky-400 rounded-full animate-spin`}
                />
            </div>
            {text && <p className="text-white/70 text-sm font-medium">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
