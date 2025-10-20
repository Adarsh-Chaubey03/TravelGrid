
import React from 'react';
import { InfoTag } from './InfoTag';



export const BusCard = ({ bus }) => {
   
    const routeNumber = bus['route_no_'];
    const from = bus.from;
    const to = bus.to;
    const depot = bus.depot;

    return (
        <div className="glass-effect-light p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                
                {/* Left Side: Route Info */}
                <div className="flex-1">
                    <div className="flex items-center space-x-4">
                        <i className="fas fa-bus text-3xl text-pink-400"></i>
                        <div>
                            <h3 className="text-xl font-bold text-white">
                                {`Route: ${routeNumber}`}
                            </h3>
                            <p className="text-sm text-white/80">{`Depot: ${depot}`}</p>
                        </div>
                    </div>
                </div>

                {/* Middle: From/To */}
                <div className="flex-grow flex items-center justify-center space-x-6 md:space-x-12">
                    <InfoTag label="From" value={from} />
                    <i className="fas fa-long-arrow-alt-right text-white/50 text-2xl hidden md:block"></i>
                    <InfoTag label="To" value={to} />
                </div>

                {/* Right Side: Action Button */}
                <div className="flex-shrink-0 pt-4 md:pt-0">
                    <button className="bg-pink-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-pink-700 transition-colors duration-200">
                        View Details
                    </button>
                    <p className="text-xs text-white/50 text-center mt-2">Static Data*</p>
                </div>
            </div>
        </div>
    );
};