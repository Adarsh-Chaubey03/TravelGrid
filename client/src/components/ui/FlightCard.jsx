// src/ui/FlightCard.js
import React from 'react';

// Helper component
const FlightDetail = ({ label, value, className = '' }) => (
    <div className={`text-center ${className}`}>
        <span className="block text-xs text-white/70 uppercase tracking-wider">{label}</span>
        <span className="block text-lg font-semibold text-white">{value || '---'}</span>
    </div>
);

// Helper component for airline logo (basic placeholder)
const AirlineLogo = ({ airlineCode }) => (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm mr-3">
        {airlineCode ? airlineCode.substring(0, 2) : '?'}
        {/* Ideally, fetch logo based on code if needed */}
    </div>
);

// Function to format date/time nicely
const formatDateTime = (isoString, type = 'time') => {
    if (!isoString) return '--:--';
    try {
        const date = new Date(isoString);
        if (type === 'time') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        if (type === 'date') {
            return date.toLocaleDateString();
        }
        return date.toLocaleString();
    } catch (e) {
        return '--:--';
    }
};

// Function to calculate duration (approximation)
const calculateDuration = (departureISO, arrivalISO) => {
    if (!departureISO || !arrivalISO) return '--h --m';
    try {
        const depDate = new Date(departureISO);
        const arrDate = new Date(arrivalISO);
        const diffMs = arrDate - depDate;
        if (diffMs < 0) return '--h --m'; // Handle potential time zone issues or errors

        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffHrs}h ${diffMins}m`;
    } catch (e) {
        return '--h --m';
    }
};

export const FlightCard = ({ flight }) => {
    // Extract data based on AviationStack structure
    const airlineName = flight.airline?.name;
    const airlineCode = flight.airline?.iata;
    const flightNumberIATA = flight.flight?.iata;
    const flightNumber = flight.flight?.number; // Sometimes number is separate

    const departureAirport = flight.departure?.iata;
    const departureTimezone = flight.departure?.timezone; // For reference
    const departureScheduled = flight.departure?.scheduled; // ISO 8601 format
    const departureTerminal = flight.departure?.terminal;
    const departureGate = flight.departure?.gate;

    const arrivalAirport = flight.arrival?.iata;
    const arrivalTimezone = flight.arrival?.timezone; // For reference
    const arrivalScheduled = flight.arrival?.scheduled; // ISO 8601 format
    const arrivalTerminal = flight.arrival?.terminal;
    const arrivalGate = flight.arrival?.gate;

    // Calculate duration (AviationStack doesn't always provide it directly)
    const duration = calculateDuration(departureScheduled, arrivalScheduled);

    // Get formatted times
    const departureDisplayTime = formatDateTime(departureScheduled, 'time');
    const arrivalDisplayTime = formatDateTime(arrivalScheduled, 'time');

    // NOTE: AviationStack Free tier usually does NOT include pricing or detailed stops info.
    // Stops might require checking if departure/arrival airports match origin/destination search
    const price = "N/A (Free API)"; // Placeholder
    const stops = "N/A"; // Placeholder

    return (
        <div className="glass-effect-light p-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl mb-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

                {/* Left Side: Airline Info */}
                <div className="flex-shrink-0 w-full md:w-1/4 flex items-center mb-4 md:mb-0">
                    <AirlineLogo airlineCode={airlineCode} />
                    <div>
                        <h3 className="text-md font-bold text-white">{airlineName || 'Unknown Airline'}</h3>
                        <p className="text-xs text-white/80">{`${airlineCode || ''} ${flightNumberIATA || flightNumber || '----'}`}</p>
                    </div>
                </div>

                {/* Middle: Flight Details */}
                <div className="flex-grow flex items-center justify-center space-x-4 md:space-x-8 w-full md:w-1/2">
                    <FlightDetail label="Depart" value={`${departureAirport} ${departureDisplayTime}`} />
                    <div className="flex flex-col items-center flex-shrink-0 mx-2">
                         <span className="text-xs text-white/70 whitespace-nowrap">{duration}</span>
                         <div className="w-full h-px bg-white/30 my-1"></div>
                         <span className="text-xs text-white/70 whitespace-nowrap">{`T:${departureTerminal || '?'} G:${departureGate || '?'}`}</span>
                    </div>
                    <FlightDetail label="Arrive" value={`${arrivalDisplayTime} ${arrivalAirport}`} />
                     <div className="flex flex-col items-center flex-shrink-0 mx-2 text-xs text-white/70">
                         <span>{`T:${arrivalTerminal || '?'}`}</span>
                         <span>{`G:${arrivalGate || '?'}`}</span>
                    </div>
                </div>

                {/* Right Side: Price & Action */}
                <div className="flex-shrink-0 w-full md:w-1/4 text-center md:text-right pt-4 md:pt-0">
                    <div className="text-lg font-bold text-white mb-2">{price}</div>
                    {/* Add any other relevant info like status if available */}
                     <p className="text-sm text-white/80 mb-2">{flight.flight_status || 'Scheduled'}</p>
                    <button className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-full cursor-not-allowed text-sm" disabled>
                        Booking N/A
                    </button>
                </div>
            </div>
        </div>
    );
};