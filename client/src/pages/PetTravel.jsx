import React from "react";

const PetTravel = () => {
    return (
        <div className="mx-auto p-4 min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-pink-900 overflow-x-hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border-white/20 max-w-xl mx-auto my-8 mt-20 text-white">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Pet Travel Guide
                </h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-pink-300 mb-2">🐾 Know Before You Go</h3>
                        <p className="text-sm leading-relaxed">
                            Always check the destination’s pet policy. Some places welcome pets with open arms, while others may have breed or size restrictions. Call ahead to hotels and attractions to confirm their rules.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-pink-300 mb-2">🧳 Pack Essentials for Your Pet</h3>
                        <p className="text-sm leading-relaxed">
                            Bring along your pet’s food, water, medications, toys, leash, poop bags, travel carrier, vaccination records, and a comfy blanket or bed to make them feel at home.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-pink-300 mb-2">🚗 Safety During Travel</h3>
                        <p className="text-sm leading-relaxed">
                            Use a well-ventilated carrier or a pet seatbelt harness during car rides. Avoid leaving pets unattended in vehicles, especially in extreme temperatures.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-pink-300 mb-2">🐶 Pet-Friendly Stays</h3>
                        <p className="text-sm leading-relaxed">
                            Opt for accommodations that are specifically pet-friendly. Some hotels provide pet beds, treats, and even room service menus for pets!
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-pink-300 mb-2">🌿 Respect Local Rules</h3>
                        <p className="text-sm leading-relaxed">
                            Keep your pet on a leash in public places unless designated otherwise. Always clean up after your pet and dispose of waste properly.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-pink-300 mb-2">🌎 International Travel Notes</h3>
                        <p className="text-sm leading-relaxed">
                            If traveling abroad, make sure your pet meets vaccination and microchip requirements of the destination country. Some may require a quarantine period.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetTravel;
