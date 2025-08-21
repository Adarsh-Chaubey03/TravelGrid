import React from 'react';
import { TravelCountdownTimer } from '../components/TravelCountdownTimer';

const CountdownDemo = () => {
    // Sample trip data for demonstration
    const sampleTrips = [
        {
            _id: '1',
            destination: 'Paris',
            country: 'France',
            startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            numberOfDays: 7,
            interests: ['Culture', 'Food', 'Art'],
            image: '/public/paris.jpeg'
        },
        {
            _id: '2',
            destination: 'Tokyo',
            country: 'Japan',
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
            numberOfDays: 10,
            interests: ['Technology', 'Food', 'Culture'],
            image: '/public/paris.jpeg'
        },
        {
            _id: '3',
            destination: 'New York',
            country: 'USA',
            startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
            numberOfDays: 5,
            interests: ['Shopping', 'Food', 'Entertainment'],
            image: '/public/paris.jpeg'
        }
    ];

    return (
        <div className="min-h-screen pt-24 px-6 pb-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Travel Countdown Timer
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Experience the excitement of upcoming trips with our interactive countdown timer,
                        daily travel tips, and social sharing features.
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                        <div className="text-4xl mb-4">⏰</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Real-time Countdown</h3>
                        <p className="text-gray-900">
                            Watch the seconds tick down to your departure with beautiful animations
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                        <div className="text-4xl mb-4">💡</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Daily Travel Tips</h3>
                        <p className="text-gray-900">
                            Get personalized tips based on destination, time until trip, and your interests
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-center">
                        <div className="text-4xl mb-4">📱</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Social Sharing</h3>
                        <p className="text-gray-900">
                            Share your excitement on social media with customizable messages
                        </p>
                    </div>
                </div>

                {/* Main Countdown Timer */}
                <div className="mb-12">
                    <TravelCountdownTimer
                        trips={sampleTrips}
                        onTripUpdate={() => {
                            console.log('Trip updated');
                        }}
                    />
                </div>

                {/* Additional Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-semibold text-white mb-4">🎨 Customizable Themes</h3>
                        <p className="text-gray-900 mb-4">
                            Choose from multiple beautiful themes including Ocean, Sunset, Forest, and Midnight.
                            Personalize your countdown experience to match your style.
                        </p>
                        <ul className="text-gray-900 space-y-2">
                            <li>• Multiple color schemes</li>
                            <li>• Progress bar animations</li>
                            <li>• Motivational messages</li>
                            <li>• Responsive design</li>
                        </ul>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                        <h3 className="text-2xl font-semibold text-white mb-4">🔔 Smart Notifications</h3>
                        <p className="text-gray-300 mb-4">
                            Never miss important trip milestones with customizable notification schedules.
                        </p>
                        <ul className="text-gray-900 space-y-2">
                            <li>• 1 week before departure</li>
                            <li>• 1 day before departure</li>
                            <li>• 1 hour before departure</li>
                            <li>• Push, email, and sound alerts</li>
                        </ul>
                    </div>
                </div>

                {/* Technical Features */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                    <h3 className="text-2xl font-semibold mb-6 text-center">🚀 Technical Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl mb-2">⚡</div>
                            <h4 className="font-semibold text-white mb-2">Real-time Updates</h4>
                            <p className="text-sm text-gray-900">Live countdown with setInterval</p>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl mb-2">🎭</div>
                            <h4 className="font-semibold text-white mb-2">Framer Motion</h4>
                            <p className="text-sm text-gray-900">Smooth animations & transitions</p>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl mb-2">📱</div>
                            <h4 className="font-semibold text-white mb-2">Responsive Design</h4>
                            <p className="text-sm text-gray-900">Mobile-first approach</p>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl mb-2">♿</div>
                            <h4 className="font-semibold text-white mb-2">Accessibility</h4>
                            <p className="text-sm text-gray-900">Screen reader support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CountdownDemo;
