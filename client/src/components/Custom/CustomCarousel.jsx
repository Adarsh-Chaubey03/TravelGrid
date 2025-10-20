import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./styles/CustomCarousel.css";
import { useTheme } from "@/context/ThemeContext";

const AUTO_SLIDE_INTERVAL = 3500; // milliseconds

const CustomCarousel = ({ guides, viewprofilehandle, viewProfileText,isHome = false }) => {
	const { isDarkMode } = useTheme();
	const [currentIndex, setCurrentIndex] = useState(0);
	const prevSlide = () => {
		setCurrentIndex((prev) => (prev - 1 + guides.length) % guides.length);
	};

	const nextSlide = () => {
		setCurrentIndex((prev) => (prev + 1) % guides.length);
	};

	// Auto-move effect
	useEffect(() => {
		const timer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
		return () => clearInterval(timer);
	}, [currentIndex, guides.length]);

	return (
		<div className="carousel-container relative flex flex-col items-center">
			{/* Left button */}
			<button
				aria-label="Previous"
				onClick={prevSlide}
				className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md shadow-lg p-3 rounded-full transition-all duration-300 ${isDarkMode
						? "bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40"
						: "bg-white/80 border border-gray-200 hover:bg-white hover:border-pink-300"
					} cursor-pointer`}
			>
				<ChevronLeft
					className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-gray-700"}`}
				/>
			</button>

			{/* <motion.div
                      key={guide.name}
                      initial={{ opacity: 0, scale: 0.85, y: 40 }}
                      animate={{ opacity: 1, scale: isCenter ? 1 : 0.9, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 40 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 40px -10px rgba(236, 72, 153, 0.3)",
                      }}
                      className={`flex-shrink-0 w-[280px] md:w-[300px] h-[400px] backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 ease-in-out cursor-pointer ${
                        isDarkMode 
                          ? 'bg-white/10 border border-white/20 hover:border-white/40' 
                          : 'bg-white/80 border border-gray-200 hover:border-pink-300'
                      } ${
                        isCenter ? "z-10 scale-100" : "opacity-80"
                      }`}
                    >
                      <img
  src={guide.image || "/assets/default-profile.jpg"}
  alt={guide.name || "Profile picture of guide"}
  className="w-24 h-24 rounded-full object-cover border-4 border-pink-400 mb-4"
/>
                      <h3 className={`text-[18px] font-semibold mb-2 transition-all duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {guide.name}
                      </h3>
                      <p className="text-pink-300 text-[15px] font-medium mb-3">
                        {guide.expertise}
                      </p>
                      <p className={`text-[15px] leading-snug px-2 mb-4 transition-all duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {guide.bio}
                      </p>

                      <button
                        onClick={() => handleguide(guide.name)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-sm font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        View Profile
                      </button>
                    </motion.div> */}

			{/* Cards */}
			<div className="carousel-track flex justify-center items-center">
				{guides.map((guide, index) => {
					let position = "hidden";
					if (index === currentIndex) position = "center";
					else if (index === (currentIndex + 1) % guides.length)
						position = "right";
					else if (index === (currentIndex - 1 + guides.length) % guides.length)
						position = "left";

					return (
						<div
							key={index}
							className={`${position} w-[280px] sm:w-[300px] h-[400px] flex items-center justify-center text-center flex-col hover:-translate-y-[10px] backdrop-blur-md rounded-2xl p-6 ${isDarkMode
									? "bg-black/30 border border-white/20 hover:border-white/40"
									: "bg-white/30 border border-gray-300 hover:border-pink-300"
								} ${position === "center" ? "scale-100" : "scale-90 opacity-80"
								} card`}
						>
							<div className="card-image">
								<img
									src={guide.cardImage || "/assets/default-card.jpg"}
									alt={guide.name || "Card image"}
									loading="eager"
									className="w-full h-48 object-cover rounded-lg"
								/>
							</div>
							<div className="card-info">
								<h3
									className={`${isDarkMode ? "text-white" : "!text-gray-900"}`}
								>
									{guide.name}
								</h3>
								<p className="expertise text-pink-500">{guide.expertise}</p>
								<p
									className="bio ${
                        isDarkMode ? '!text-gray-300' : '!text-gray-600'
                      }"
								>
									{guide.bio}
								</p>
								<button
									aria-label={viewProfileText}
									className={`view-btn ${isHome
											? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
											: "bg-gradient-to-r from-[#db2777] to-[#ec4899] hover:from-[#be185d] hover:to-[#db2777]"
										}`}
									onClick={() => viewprofilehandle(guide.name)}
								>
									{viewProfileText}
								</button>

							</div>
						</div>
					);
				})}
			</div>

			{/* Right button */}
			<button
				aria-label="Next"
				onClick={nextSlide}
				className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 backdrop-blur-md shadow-lg p-3 rounded-full transition-all duration-300 ${isDarkMode
						? "bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40"
						: "bg-white/80 border border-gray-200 hover:bg-white hover:border-pink-300"
					} cursor-pointer`}
			>
				<ChevronRight
					className={`w-6 h-6 ${isDarkMode ? "text-white" : "text-gray-700"}`}
				/>
			</button>

			{/* Navigation dots BELOW cards */}
			<div className="flex justify-center mt-6 space-x-2">
				{guides.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentIndex(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							currentIndex === index
							? "bg-pink-500 scale-110" // Active dot (no change)
							: isDarkMode
							? "bg-pink-700 hover:bg-pink-600" // Inactive dot (Dark Mode) - Lighter
							: "bg-pink-300 hover:bg-pink-400" // Inactive dot (Light Mode) - Darker
						}`}
					/>
				))}
			</div>
		</div>
	);
};

export default CustomCarousel;
