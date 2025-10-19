

export const TrainCard = ({ train }) => (
    <div className="glass-effect rounded-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-white animate-fade-in">
        <div className="md:col-span-2">
            <p className="font-bold text-lg">{train.trainName}</p>
            <p className="text-sm text-gray-300">#{train.trainNumber}</p>
        </div>
        <div className="md:col-span-2 flex justify-between md:justify-around items-center">
            <div>
                <p className="text-sm font-semibold">{train.from.name}</p>
                <p className="text-sm text-gray-400 pt-3">{train.departure}</p>
            </div>
            <div className="text-center">
                <i className="fa-solid fa-arrow-right-long text-white"></i>
                <p className="text-xs text-gray-400">{train.duration}</p>
            </div>
            &nbsp;
            &nbsp;
            <div>
                <p className="text-sm font-semibold">{train.to.name}</p>
                <p className="text-sm text-gray-400 pt-3">{train.arrival}</p>
            </div>
        </div>
        <div className="md:col-span-1 text-center md:text-right">
            <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full md:w-auto">
                Book Now
            </button>
        </div>
    </div>
);