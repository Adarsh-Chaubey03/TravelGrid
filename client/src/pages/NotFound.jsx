import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Map, Ticket, BookOpen, Mail, ArrowRight } from 'lucide-react';

const NotFound = () => {
    // Create a 3D hover effect for the button
    useEffect(() => {
        const btn = document.querySelector('.home-btn');
        if (!btn) return;

        const handleMouseMove = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const maxRotate = 10;

            const rotateX = maxRotate * (y - centerY) / centerY * -1;
            const rotateY = maxRotate * (x - centerX) / centerX;

            btn.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        };

        const handleMouseLeave = () => {
            btn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };

        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            btn.removeEventListener('mousemove', handleMouseMove);
            btn.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-black to-pink-900">

            <main className="flex flex-1 items-center justify-center w-full px-4 py-12">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" aria-hidden="true">
                        <div className="absolute left-[10%] top-[20%] w-36 h-36 bg-pink-500 rounded-full filter blur-3xl"></div>
                        <div className="absolute right-[15%] top-[15%] w-32 h-32 bg-blue-500 rounded-full filter blur-3xl"></div>
                        <div className="absolute left-[30%] bottom-[30%] w-40 h-40 bg-pink-600 rounded-full filter blur-3xl"></div>
                        <div className="absolute right-[20%] bottom-[20%] w-28 h-28 bg-indigo-600 rounded-full filter blur-3xl"></div>
                    </div>


                    {/* Error code with animated gradient */}
                    <div
                        className="text-[12rem] font-bold leading-none tracking-tight mb-6 bg-clip-text text-transparent relative"
                        style={{
                            backgroundImage: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
                            backgroundSize: "400% 400%",
                            animation: "gradient 15s ease infinite"
                        }}
                    >
                        404
                        <style>{`
              @keyframes gradient {
                0% { background-position: 0% 50% }
                50% { background-position: 100% 50% }
                100% { background-position: 0% 50% }
              }
            `}</style>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                        Page Not Found
                    </h1>

                    <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
                        Oops! It seems you've ventured into uncharted territory. The page you're looking for has either been moved or doesn't exist.
                    </p>

                    {/* Destinations you might be looking for */}
                    <div className="mb-12">
                        <h2 className="text-xl font-semibold text-pink-400 mb-4">Popular Destinations</h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                { name: 'Home', path: '/', icon: <Home className="w-4 h-4 mr-1" /> },
                                { name: 'Discover', path: '/discover', icon: <Map className="w-4 h-4 mr-1" /> },
                                { name: 'Travel Guides', path: '/guides', icon: <BookOpen className="w-4 h-4 mr-1" /> },
                                { name: 'Book Tickets', path: '/ticket', icon: <Ticket className="w-4 h-4 mr-1" /> },
                                { name: 'Contact Us', path: '/contact', icon: <Mail className="w-4 h-4 mr-1" /> }
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="px-4 py-2 bg-gray-800 bg-opacity-50 hover:bg-opacity-70 rounded-full text-white transition-colors inline-flex items-center"
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main CTA Button with 3D effect */}
                    <Link
                        to="/"
                        className="home-btn inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-pink-600 hover:to-pink-700 group"
                        style={{ transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                    >
                        <Home className="w-6 h-6 mr-2" />
                        Return to Homepage
                        <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                </div>
            </main>

        </div>
    );
};

export default NotFound;