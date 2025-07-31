
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { packages } from "../data/PackageData";
import Navbar from "../components/Custom/Navbar";

// Function to extract numerical price from a formatted string like "₹10,000"
const parsePrice = (priceStr) => {
	if (!priceStr) return 0;
	const digitsOnly = String(priceStr).replace(/[^\d]/g, ""); // remove non-digit characters
	return parseInt(digitsOnly, 10);
};

const TravelPackages = () => {
	// All filter-related state
	const [minRating, setMinRating] = useState(0);
	const [maxPrice, setMaxPrice] = useState(Infinity);
	const [selectedContinent, setSelectedContinent] = useState("All");
	const [selectedCountry, setSelectedCountry] = useState("All");
	const [selectedSeason, setSelectedSeason] = useState("All");
	const [selectedDuration, setSelectedDuration] = useState("All");

	const navigate = useNavigate();

	// Filters the packages based on all the selected criteria
	const filteredPackages = packages.filter((pkg) => {
		const matchContinent =
			selectedContinent === "All" || pkg.continent === selectedContinent;

		const matchCountry =
			selectedCountry === "All" || pkg.country === selectedCountry;

		const matchSeason =
			selectedSeason === "All" || pkg.season === selectedSeason;

		// Extract number of days from the `duration` string like "5 Days / 4 Nights"
		const match = pkg.duration.match(/^(\d+)/);
		const days = match ? Number(match[1]) : 0;

		// Match based on selected duration range
		const matchDuration =
			selectedDuration === "All" ||
			(selectedDuration === "1-3" && days <= 3) ||
			(selectedDuration === "4-7" && days >= 4 && days <= 7) ||
			(selectedDuration === "8-14" && days >= 8 && days <= 14) ||
			(selectedDuration === "15+" && days > 14);

		const matchRating = pkg.rating >= minRating;
		const matchPrice = parsePrice(pkg.price) <= maxPrice;

		// Final filter result for this package
		return (
			matchContinent &&
			matchCountry &&
			matchSeason &&
			matchDuration &&
			matchRating &&
			matchPrice
		);
	});

	// Converts input price to number or sets it to infinity if empty
	const handlePriceChange = (e) => {
		const val = e.target.value;
		if (val === "") {
			setMaxPrice(Infinity);
		} else {
			setMaxPrice(Number(val));
		}
	};

	// Returns unique values from the packages array for dropdown filters
	const getUniqueOptions = (key) => {
		const values = packages.map((pkg) => {
			if (key === "duration") {
				// Extract number of days from string
				const match = pkg.duration.match(/^(\d+)/);
				return match ? Number(match[1]) : 0;
			}
			return pkg[key];
		});

		if (key === "duration") {
			const ranges = new Set();
			values.forEach((val) => {
				if (val <= 3) ranges.add("1-3");
				else if (val <= 7) ranges.add("4-7");
				else if (val <= 14) ranges.add("8-14");
				else ranges.add("15+");
			});
			return Array.from(ranges).sort();
		}

		return [...new Set(values)].sort(); // remove duplicates and sort
	};

	// Dropdown options for each filter
	const continentOptions = getUniqueOptions("continent");
	const countryOptions = getUniqueOptions("country");
	const seasonOptions = getUniqueOptions("season");
	const durationOptions = getUniqueOptions("duration");

	return (
		<div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-black to-pink-900 overflow-x-hidden">
			<Navbar />
			<main className="flex flex-col flex-1 w-full items-center pt-24">
				<section className="w-full py-24 text-center px-4">
					{/* Heading and subheading */}
					<h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
						Discover Our <span className="text-pink-400">Travel Packages</span>
					</h1>
					<p className="text-lg md:text-xl text-pink-200 max-w-2xl mx-auto mb-6">
						Handpicked vacation deals crafted for unforgettable experiences.
					</p>

					{/* Custom Travel Plan Generator Button */}
					<div className="flex justify-center mb-8">
						<button
							onClick={() => navigate('/travel-plan-generator')}
							className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center"
						>
							<span className="mr-2">🎯</span>
							Create Custom Travel Plan
						</button>
					</div>

					{/* Filter dropdowns */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 w-full bg-pink-900 p-4 rounded-xl shadow-lg text-white mt-4">
						{/* Minimum Rating Filter */}
						<div className="flex flex-col gap-1 text-left">
							<label htmlFor="minRating" className="text-md font-semibold">
								Minimum Rating:
							</label>
							<select
								id="minRating"
								value={minRating}
								onChange={(e) => setMinRating(Number(e.target.value))}
								className="w-full bg-pink-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-center md:text-left">
								<option value={0}>All</option>
								<option value={1}>1 Star & Up</option>
								<option value={2}>2 Stars & Up</option>
								<option value={3}>3 Stars & Up</option>
								<option value={4}>4 Stars & Up</option>
								<option value={5}>5 Stars Only</option>
							</select>
						</div>

						{/* Continent Filter */}
						<div className="flex flex-col gap-1 text-left">
							<label htmlFor="continent" className="font-semibold text-md">
								Continent:
							</label>
							<select
								value={selectedContinent}
								onChange={(e) => setSelectedContinent(e.target.value)}
								className="w-full bg-pink-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-center md:text-left">
								<option value="All">All</option>
								{continentOptions.map((continent) => (
									<option key={continent} value={continent}>
										{continent}
									</option>
								))}
							</select>
						</div>

						{/* Country Filter */}
						<div className="flex flex-col gap-1 text-left">
							<label htmlFor="country" className="font-semibold text-md">
								Country:
							</label>
							<select
								value={selectedCountry}
								onChange={(e) => setSelectedCountry(e.target.value)}
								className="w-full bg-pink-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-center md:text-left">
								<option value="All">All</option>
								{countryOptions.map((country) => (
									<option key={country} value={country}>
										{country}
									</option>
								))}
							</select>
						</div>

						{/* Season Filter */}
						<div className="flex flex-col gap-1 text-left">
							<label htmlFor="season" className="font-semibold text-md">
								Season:
							</label>
							<select
								value={selectedSeason}
								onChange={(e) => setSelectedSeason(e.target.value)}
								className="w-full bg-pink-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-center md:text-left">
								<option value="All">All</option>
								{seasonOptions.map((season) => (
									<option key={season} value={season}>
										{season}
									</option>
								))}
							</select>
						</div>

						{/* Duration Filter */}
						<div className="flex flex-col gap-1 text-left">
							<label htmlFor="duration" className="font-semibold text-md">
								Duration:
							</label>
							<select
								id="duration"
								value={selectedDuration}
								onChange={(e) => setSelectedDuration(e.target.value)}
								className="w-full bg-pink-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-center md:text-left">
								<option value="All">All</option>
								{durationOptions.map((duration) => (
									<option key={duration} value={duration}>
										{duration === "1-3"
											? "1-3 Days"
											: duration === "4-7"
											? "4-7 Days"
											: duration === "8-14"
											? "8-14 Days"
											: "15+ Days"}
									</option>
								))}
							</select>
						</div>

						{/* Max Price Filter */}
						<div className="flex flex-col gap-1 text-left">
							<label htmlFor="maxPrice" className="font-semibold text-md">
								Max Price (₹):
							</label>
							<input
								type="number"
								id="maxPrice"
								placeholder="No limit"
								onChange={handlePriceChange}
								className="w-full bg-pink-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400 text-center md:text-left"
								min="0"
							/>
						</div>
					</div>
				</section>

				{/* Filtered Travel Packages Grid */}
				<section className="max-w-7xl w-full px-4 pb-16 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{filteredPackages.length > 0 ? (
						filteredPackages.map((pkg) => (
							<div
								key={pkg.id}
								className="backdrop-blur-sm bg-white/5 border border-pink-400/20 rounded-2xl shadow-xl hover:bg-white/8 transition-shadow duration-300 hover:shadow-2xl cursor-pointer"
								onClick={() => navigate(`/package/${pkg.id}`)}>
								<img
									src={pkg.image}
									alt={pkg.title}
									className="w-full h-56 object-cover"
								/>
								<div className="p-6 flex-1 flex flex-col">
									<h3 className="text-2xl font-semibold text-white mb-1">
										{pkg.title}
									</h3>
									<span className="text-pink-300 font-medium mb-2">
										{pkg.duration}
									</span>

									{/* Star Rating */}
									<div className="flex gap-1 mb-1">
										{[...Array(5)].map((_, idx) => (
											<svg
												key={idx}
												className={`w-5 h-5 ${
													idx < pkg.rating ? "text-yellow-400" : "text-gray-300"
												}`}
												fill="currentColor"
												viewBox="0 0 20 20">
												<path d="M9.049 2.927a1 1 0 011.902 0l1.517 4.674a1 1 0 00.95.69h4.911c.969 0 1.371 1.24.588 1.81l-3.978 2.89a1 1 0 00-.364 1.118l1.517 4.674c.3.921-.755 1.688-1.538 1.118l-3.978-2.89a1 1 0 00-1.176 0l-3.978 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.978-2.89c-.784-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.517-4.674z" />
											</svg>
										))}
									</div>

									<p className="text-pink-200 font-semibold mb-4">
										{pkg.price}
									</p>

									{/* Single Review Display */}
									<div className="mb-4">
										<h4 className="text-pink-400 text-lg font-bold mb-2">
											Reviews
										</h4>
										{pkg.reviews && pkg.reviews.length > 0 ? (
											<ul className="space-y-1 text-pink-100 text-sm max-h-28 overflow-y-auto pr-2">
												{pkg.reviews.slice(0, 1).map((review, idx) => (
													<li key={idx}>
														<span className="font-semibold text-pink-300">
															{review.name}:
														</span>{" "}
														{review.comment}
													</li>
												))}
											</ul>
										) : (
											<p className="text-pink-300 text-xs italic">
												No reviews yet.
											</p>
										)}
									</div>

									{/* Action Button */}
									<div className="flex flex-row items-center gap-4">
										<button
											onClick={() => navigate(`/package/${pkg.id}`)}
											className="bg-gradient-to-r from-pink-600 to-pink-500 text-white px-5 py-2 rounded-lg font-semibold transition-all transform hover:scale-105">
											Book Now
										</button>
									</div>
								</div>
							</div>
						))
					) : (
						<p className="text-pink-300 text-center col-span-full">
							No packages match the selected filters.
						</p>
					)}
				</section>
			</main>
		</div>
	);
};

export default TravelPackages;