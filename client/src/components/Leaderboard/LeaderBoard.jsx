import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTrophy,
  FaMedal,
  FaStar,
  FaCode,
  FaUsers,
  FaGithub,
} from "react-icons/fa";

const GITHUB_REPO = "Adarsh-Chaubey03/TravelGrid";
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN || "";

// Points configuration for different PR levels
const POINTS = {
  level1: 3, // Easy
  level2: 7, // Medium
  level3: 10, // Hard/Feature
};

// Badge component for PR counts
const Badge = ({ count, label, color }) => (
  <div
    className={`flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${color} bg-opacity-20`}
  >
    <FaCode className="mr-1 sm:mr-1.5 text-xs" />
    <span>
      {count} {label}
    </span>
  </div>
);

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
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
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
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
  const [stats, setStats] = useState({
    totalPRs: 0,
    totalContributors: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const fetchContributorsWithPoints = async () => {
      try {
        let contributorsMap = {};
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const res = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/pulls?state=closed&per_page=100&page=${page}`,
            { headers: TOKEN ? { Authorization: `token ${TOKEN}` } : {} }
          );

          const prs = await res.json();
          if (prs.length === 0) {
            hasMore = false;
            break;
          }

          prs.forEach((pr) => {
            if (!pr.merged_at) return;

            const labels = pr.labels.map((l) => l.name.toLowerCase());
            if (!labels.includes("gssoc25")) return;

            const author = pr.user.login;
            let points = 0;
            labels.forEach((label) => {
              const normalized = label.replace(/\s+/g, "").toLowerCase();
              if (POINTS[normalized]) {
                points += POINTS[normalized];
              }
            });

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

        setContributors(
          Object.values(contributorsMap).sort((a, b) => b.points - a.points)
        );
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributorsWithPoints();
  }, []);

  // Calculate stats when contributors data is loaded
  useEffect(() => {
    if (contributors.length > 0) {
      const totalPRs = contributors.reduce((sum, c) => sum + Number(c.prs), 0);
      const totalPoints = contributors.reduce(
        (sum, c) => sum + Number(c.points),
        0
      );

      const flooredTotalPRs = Math.floor(totalPRs / 10) * 10;
      const flooredTotalPoints = Math.floor(totalPoints / 10) * 10;
      const flooredContributorsCount =
        Math.floor(contributors.length / 10) * 10;

      // console.log(flooredContributorsCount,flooredTotalPoints,flooredTotalPRs)

      setStats({
        flooredTotalPRs,
        totalContributors: flooredContributorsCount,
        flooredTotalPoints,
      });
    }
  }, [contributors]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 py-6 sm:py-12 px-2 sm:px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-pink-600 dark:text-accent-500 mb-2 sm:mb-4 mt-20">
            GSSoC'25 Leaderboard
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Celebrating the amazing contributions from GSSoC'25 participants.
            Join us in building something incredible together!
          </p>
        </motion.div>

        

        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mx-2 sm:mx-0">
            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-pink-400 border-b border-pink-500 ">
              <div className="col-span-1 text-sm font-medium text-black">
                Rank
              </div>
              <div className="col-span-6 md:col-span-7 text-sm font-medium text-black ">
                Contributor
              </div>
              <div className="col-span-5 md:col-span-4 text-sm font-medium text-black text-center">
                Contributions
              </div>
            </div>

            {/* Contributors List */}
            <div className="divide-y divide-pink-400 ">
              {contributors.map((contributor, index) => (
                <motion.div
                  key={contributor.username}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="group hover:bg-gray-700 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden p-4">
                    <div className="flex items-center space-x-3">
                      {/* Rank Badge */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                            : index === 1
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            : index === 2
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {/* Avatar */}
                      <img
                        src={contributor.avatar}
                        alt={contributor.username}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm flex-shrink-0"
                      />

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <a
                              href={contributor.profile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-gray-900 dark:text-pink-900 hover:text-primary-600 dark:hover:text-accent-400 transition-colors text-sm truncate block"
                            >
                              {contributor.username}
                            </a>
                            <a
                              href={`https://github.com/${GITHUB_REPO}/pulls?q=is:pr+author:${contributor.username}+is:merged`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-accent-400 transition-colors block"
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
                            color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          />
                          <Badge
                            count={contributor.points}
                            label="Points"
                            color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
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
                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                            : index === 1
                            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                            : index === 2
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400"
                        }`}
                      >
                        <span className="font-medium">{index + 1}</span>
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-7">
                      <div className="flex items-center space-x-4">
                        <img
                          src={contributor.avatar}
                          alt={contributor.username}
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                        />
                        <div>
                          <a
                            href={contributor.profile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-accent-400 transition-colors"
                          >
                            {contributor.username}
                          </a>
                          <div className="flex items-center mt-1 space-x-2">
                            <a
                              href={`https://github.com/${GITHUB_REPO}/pulls?q=is:pr+author:${contributor.username}+is:merged`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-accent-400 transition-colors"
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
                          color="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        />
                        <Badge
                          count={contributor.points}
                          label="Points"
                          color="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            
          </div>
        )}

        
      </div>
    </div>
  );
}
