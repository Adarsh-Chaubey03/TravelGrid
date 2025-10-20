export const InfoTag = ({ label, value }) => (
    <div className="text-center">
        <span className="block text-xs text-white/70 uppercase tracking-wider">{label}</span>
        <span className="block text-lg font-semibold text-white">{value}</span>
    </div>
);