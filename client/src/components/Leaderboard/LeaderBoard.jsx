import { useEffect, useState } from "react";

const GITHUB_REPO = "Adarsh-Chaubey03/TravelGrid";
// NOTE: Ensure VITE_GITHUB_TOKEN is properly set in your environment variables for higher rate limits.
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

// Points configuration for different PR levels
const POINTS = {
  level1: 3, // Easy
  level2: 7, // Medium
  level3: 10, // Hard/Feature
};

// Simple Code Icon Component
const CodeIcon = ({ className = "" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Badge component for PR counts (UI component)
const Badge = ({ count, label, color }) => (
  <div
    className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${color} bg-opacity-20`}
  >
    <CodeIcon className="mr-1 sm:mr-1.5 w-3 h-3" />
    <span>
      {count} {label}
    </span>
  </div>
);

// Skeleton Loader Component (UI component)
const SkeletonLoader = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
    {/* Desktop Table Header - Hidden on mobile */}
    <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
      <div className="col-span-1 text-sm font-medium text-gray-500 dark:text-gray-400">
        #
      </div>
      <div className="col-span-6 md:col-span-7 text-sm font-medium text-gray-500 dark:text-gray-400">
        Contributor
      </div>
      <div className="col-span-5 md:col-span-4 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">
        Contributions
      </div>
    </div>

    {/* Rows */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="p-4 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center sm:px-6 sm:py-4"
        >
          {/* Mobile Layout */}
          <div className="flex items-center space-x-3 sm:hidden">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="flex space-x-2">
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Hidden on mobile */}
          <div className="hidden sm:contents">
            {/* Rank */}
            <div className="col-span-1">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>

            {/* Contributor Info */}
            <div className="col-span-6 md:col-span-7">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="col-span-5 md:col-span-4">
              <div className="flex items-center justify-end space-x-3">
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function LeaderBoard() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark mode from system preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;

    const fetchContributorsWithPoints = async () => {
      try {
        let contributorsMap = {};
        let page = 1;
        let hasMore = true;

        while (hasMore && isMounted) {
          // Safety measure to prevent runaway requests
          if (page > 100) {
            console.warn("Safety break: Exceeded maximum pagination pages (100).");
            hasMore = false;
            break;
          }

          const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/pulls?state=closed&per_page=100&page=${page}`;
          const headers = TOKEN ? { Authorization: `token ${TOKEN}` } : {};

          const res = await fetch(apiUrl, {
            headers,
            signal: abortController.signal,
          });

          // HTTP Status Check & Loop Break
          if (!res.ok) {
            const errorStatus = res.status;
            let errorMessage = `GitHub API Error: Status ${errorStatus}. Could not fetch pull requests.`;

            if (errorStatus === 401 || errorStatus === 403) {
              errorMessage =
                "API Fetch failed. Check your GitHub Token or API Rate Limit.";
            }

            console.error(errorMessage, await res.text());
            
            // Only set error if component is still mounted
            if (isMounted) {
              setApiError(errorMessage);
            }

            hasMore = false;
            break;
          }

          const prs = await res.json();

          // Break the loop if the response is an empty array
          if (prs.length === 0) {
            hasMore = false;
            break;
          }

          prs.forEach((pr) => {
            // Only count merged PRs
            if (!pr.merged_at) return;

            const labels = pr.labels.map((l) => l.name.toLowerCase());
            // Only count PRs with the relevant GSSoC label (case-insensitive)
            if (!labels.some((label) => label.includes("gssoc"))) return;

            const author = pr.user.login;
            let points = 0;

            // Calculate points based on labels
            labels.forEach((label) => {
              const normalized = label.replace(/\s+/g, "").toLowerCase();
              if (POINTS[normalized]) {
                points += POINTS[normalized];
              }
            });

            // Initialize or update contributor entry
            if (!contributorsMap[author]) {
              contributorsMap[author] = {
                username: author,
                avatar: pr.user.avatar_url,
                profile: pr.user.html_url,
                points: 0,
                prs: 0,
              };
            }

            contributorsMap[author].points += points;
            contributorsMap[author].prs += 1;
          });

          page++;
        }

        // Only update state if component is still mounted and no error occurred
        if (isMounted && !apiError) {
          const finalContributors = Object.values(contributorsMap).sort(
            (a, b) => b.points - a.points
          );
          setContributors(finalContributors);
        }
      } catch (error) {
        // Handle abort error separately
        if (error.name === "AbortError") {
          console.log("Fetch aborted - component unmounted");
          return;
        }

        // Handles network errors (e.g., connection lost)
        console.error("Network or parsing error fetching contributors:", error);
        
        // Only set error if component is still mounted
        if (isMounted) {
          setApiError(
            "A network error occurred. Please check your internet connection."
          );
        }
      } finally {
        // Ensure loading state is turned off only if mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContributorsWithPoints();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []); // Empty dependency array - runs once on mount

  // Retry function
  const handleRetry = () => {
    setLoading(true);
    setApiError(null);
    setContributors([]);
    // Force re-render by updating a key or using a different approach
    window.location.reload();
  };

  return (
    <div
      className={`min-h-screen py-6 sm:py-12 px-2 sm:px-4 ${
        isDarkMode 
        ? 'bg-gradient-to-br from-black to-pink-900'
        : 'from-pink-200/50 via-white/70 to-blue-200/50'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 px-2 opacity-0 animate-fade-in">
          <h1
            className={`text-4xl sm:text-5xl font-bold mb-2 sm:mb-4 mt-20 ${
              isDarkMode ? "text-pink-400" : "text-pink-600"
            }`}
          >
            GSSoC'25 Leaderboard
          </h1>
          <p
            className={`text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Celebrating the amazing contributions from GSSoC'25 participants.
            Join us in building something incredible together!
          </p>
        </div>

        {/* Error Message Display */}
        {apiError && !loading && (
          <div
            className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-8 opacity-0 animate-fade-in"
            role="alert"
          >
            <strong className="font-bold">Error Loading Data:</strong>
            <span className="block sm:inline ml-2">{apiError}</span>
            <p className="text-sm mt-1">
              Please try again later. If using a personal token, ensure it is
              valid and your rate limit hasn't been exceeded.
            </p>
            <button
              onClick={handleRetry}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <SkeletonLoader />
        ) : contributors.length === 0 && !apiError ? (
          // Display if loading is false, no error, but no contributors found
          <div
            className={`text-center py-20 rounded-xl shadow-sm border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            <CodeIcon
              className={`mx-auto h-12 w-12 mb-4 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-lg font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No Contributions Found
            </h3>
            <p
              className={`mt-1 text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              The repository may not have any merged PRs labeled with GSSoC yet.
            </p>
          </div>
        ) : (
          <div
            className={`rounded-xl shadow-sm border overflow-hidden mx-2 sm:mx-0 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-100"
            }`}
          >
            {/* Desktop Table Header - Hidden on mobile */}
            <div
              className={`hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b ${
                isDarkMode
                  ? "bg-pink-900/30 border-pink-800 text-pink-200"
                  : "bg-pink-100 border-pink-200 text-pink-900"
              }`}
            >
              <div className="col-span-1 text-sm font-medium">Rank</div>
              <div className="col-span-6 md:col-span-7 text-sm font-medium">
                Contributor
              </div>
              <div className="col-span-5 md:col-span-4 text-sm font-medium text-center">
                Contributions
              </div>
            </div>

            {/* Contributors List */}
            <div
              className={`divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {contributors.map((contributor, index) => (
                <div
                  key={contributor.username}
                  className={`group transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-700/50"
                      : "hover:bg-gray-50"
                  }`}
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.3s ease-in forwards ${index * 0.02}s`,
                  }}
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden p-4">
                    <div className="flex items-center space-x-3">
                      {/* Rank Badge */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                          index === 0
                            ? isDarkMode
                              ? "bg-yellow-500/30 text-yellow-300"
                              : "bg-yellow-200 text-yellow-700"
                            : index === 1
                            ? isDarkMode
                              ? "bg-gray-400/30 text-gray-300"
                              : "bg-gray-300 text-gray-700"
                            : index === 2
                            ? isDarkMode
                              ? "bg-amber-600/30 text-amber-300"
                              : "bg-amber-200 text-amber-700"
                            : isDarkMode
                            ? "bg-gray-600/30 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Avatar */}
                      <img
                        src={contributor.avatar}
                        alt={`${contributor.username}'s avatar`}
                        className={`w-10 h-10 rounded-full border-2 shadow-sm flex-shrink-0 ${
                          isDarkMode ? "border-gray-700" : "border-white"
                        }`}
                      />

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <a
                              href={contributor.profile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`font-medium transition-colors text-sm truncate block ${
                                isDarkMode
                                  ? "text-gray-200 hover:text-pink-400"
                                  : "text-gray-700 hover:text-pink-600"
                              }`}
                            >
                              {contributor.username}
                            </a>
                            <a
                              href={`https://github.com/${GITHUB_REPO}/pulls?q=is:pr+author:${contributor.username}+is:merged`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs transition-colors block ${
                                isDarkMode
                                  ? "text-gray-400 hover:text-gray-300"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              View Contributions →
                            </a>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            count={contributor.prs}
                            label={`PR${contributor.prs !== 1 ? "s" : ""}`}
                            color={
                              isDarkMode
                                ? "bg-blue-900/30 text-blue-300"
                                : "bg-blue-100 text-blue-700"
                            }
                          />
                          <Badge
                            count={contributor.points}
                            label="Points"
                            color={
                              isDarkMode
                                ? "bg-purple-900/30 text-purple-300"
                                : "bg-purple-100 text-purple-700"
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout - Hidden on mobile */}
                  <div className="hidden sm:grid grid-cols-12 gap-4 items-center px-6 py-4">
                    <div className="col-span-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? isDarkMode
                              ? "bg-yellow-500/30 text-yellow-300"
                              : "bg-yellow-200 text-yellow-700"
                            : index === 1
                            ? isDarkMode
                              ? "bg-gray-400/30 text-gray-300"
                              : "bg-gray-300 text-gray-700"
                            : index === 2
                            ? isDarkMode
                              ? "bg-amber-600/30 text-amber-300"
                              : "bg-amber-200 text-amber-700"
                            : isDarkMode
                            ? "bg-gray-600/30 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        <span className="font-medium">{index + 1}</span>
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-7">
                      <div className="flex items-center space-x-4">
                        <img
                          src={contributor.avatar}
                          alt={`${contributor.username}'s avatar`}
                          className={`w-10 h-10 rounded-full border-2 shadow-sm ${
                            isDarkMode ? "border-gray-700" : "border-white"
                          }`}
                        />
                        <div>
                          <a
                            href={contributor.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`font-medium transition-colors ${
                              isDarkMode
                                ? "text-gray-200 hover:text-pink-400"
                                : "text-gray-700 hover:text-pink-600"
                            }`}
                          >
                            {contributor.username}
                          </a>
                          <div className="flex items-center mt-1 space-x-2">
                            <a
                              href={`https://github.com/${GITHUB_REPO}/pulls?q=is:pr+author:${contributor.username}+is:merged`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-xs transition-colors ${
                                isDarkMode
                                  ? "text-gray-400 hover:text-gray-300"
                                  : "text-gray-500 hover:text-gray-700"
                              }`}
                            >
                              View Contributions →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-5 md:col-span-4">
                      <div className="flex items-center justify-end space-x-3">
                        <Badge
                          count={contributor.prs}
                          label={`PR${contributor.prs !== 1 ? "s" : ""}`}
                          color={
                            isDarkMode
                              ? "bg-blue-900/30 text-blue-300"
                              : "bg-blue-100 text-blue-700"
                          }
                        />
                        <Badge
                          count={contributor.points}
                          label="Points"
                          color={
                            isDarkMode
                              ? "bg-purple-900/30 text-purple-300"
                              : "bg-purple-100 text-purple-700"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
