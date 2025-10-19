export const MessageDisplay = ({ message, type = 'info' }) => {
    const colorClass = type === 'error' ? 'bg-red-500/50 border-red-500' : 'bg-blue-500/50 border-blue-500';
    return (
        <div className={`glass-effect rounded-lg p-8 text-center text-white border ${colorClass}`}>
            <p className="text-lg">{message}</p>
        </div>
    );
};