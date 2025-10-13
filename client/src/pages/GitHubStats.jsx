import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from "../context/ThemeContext";
import { Star, GitFork, AlertCircle, Users, Clock, HardDrive, ArrowRight } from 'lucide-react';
import CountUp from 'react-countup';

const GITHUB_USER = "Adarsh-Chaubey03";
const GITHUB_REPO = "TravelGrid";

export default function HowItWorks() {
  const [hoveredStep, setHoveredStep] = useState(null);
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState({
    stars: 0,
    forks: 0,
    issues: 0,
    contributors: 0,
    lastCommit: "",
    size: 0,
  });

  useEffect(() => {
    async function fetchGitHubStats() {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const repoRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`, { headers });
        const repoData = await repoRes.json();
        const contributorsRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contributors?per_page=1&anon=true`, { headers });
        const contributorsCount = contributorsRes.headers.get("Link")?.match(/&page=(\d+)>; rel="last"/)?.[1] || 0;

        const commitDate = new Date(repoData.pushed_at);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const formattedDate = commitDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });

        let lastCommitLabel;
        if (commitDate.toDateString() === today.toDateString()) {
          lastCommitLabel = `Today ${formattedDate}`;
        } else if (commitDate.toDateString() === yesterday.toDateString()) {
          lastCommitLabel = `Yesterday ${formattedDate}`;
        } else {
          lastCommitLabel = formattedDate;
        }

        setStats({
          stars: repoData.stargazers_count || 0,
          forks: repoData.forks_count || 0,
          issues: repoData.open_issues_count || 0,
          contributors: contributorsCount || 0,
          lastCommit: lastCommitLabel,
          size: repoData.size || 0,
        });
      } catch (err) {
        console.error("Error fetching GitHub stats:", err);
      }
    }

    fetchGitHubStats();
  }, []);

  const steps = [
    {
      id: 1,
      value: stats.stars,
      emoji: "⭐",
      icon: Star,
      label: "Stars",
      title: "Repository Stars",
      description: "Total stars received from the developer community",
      link: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/stargazers`
    },
    {
      id: 2,
      label: "Forks",
      emoji: "🍴",

      value: stats.forks,
      icon: GitFork,
      title: "Project Forks",
      description: "Number of times the repository has been forked",
      link: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/network/members`
    },
    {
      id: 3,
      label: "Issues",
      value: stats.issues,
      emoji: "🐛",
      icon: AlertCircle,
      title: "Open Issues",
      description: "Currently tracked bugs and feature requests",
      link: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/issues`
    },
    {
      id: 4,
      label: "Contributors",
      value: stats.contributors,
      icon: Users,
      emoji: "👥",
      title: "Contributors",
      description: "Developers contributing to the project",
      link: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/graphs/contributors`
    },
    {
      id: 5,
      label: "Last Commit",
      value: stats.lastCommit,
      icon: Clock,
      emoji: "⏰",
      title: "Latest Activity",
      description: "Most recent commit to the repository",
      link: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/commits`
    },
    {
      id: 6,
      label: "Repo Size",
      value: stats.size,
      emoji: "💾",
      icon: HardDrive,
      title: "Repository Size",
      description: "Total size of the codebase in KB",
      link: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}`
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen text-white py-12 px-4 sm:py-20 sm:px-6 lg:px-8">

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`text-3xl sm:text-4xl font-bold text-center mb-12 py-5  transition-all duration-300 ${isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
      >
        Project  <span className="text-pink-400">Performace Overview</span>
        <p className="text-sm  sm:text-md mt-5 md:text-md max-w-3xl mx-auto px-4">
          Real-time statistics and metrics from the TravelGrid repository
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Desktop and Tablet View - 6 columns for 6 stats */}
        <div className="hidden lg:block relative">
          {/* Progress Line */}
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-gray-800">
            <motion.div
              variants={lineVariants}
              className="h-full bg-gradient-to-r from-pink-600 via-ornage-500 to-red-600 origin-left"
            />
          </div>

          {/* Steps - 6 columns */}
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, index) => (
              <motion.a
                key={step.id}
                href={step.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="relative cursor-pointer"
                onHoverStart={() => setHoveredStep(step.id)}
                onHoverEnd={() => setHoveredStep(null)}
              >
                {/* Step Label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-center"
                >
                  {step.label}
                </motion.div>

                {/* Icon Circle */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    className="relative"
                  >
                    <div className={`w-20 h-20 rounded-full ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-600 to-gray-900' 
                        : 'bg-gradient-to-br from-gray-200 to-gray-300'
                    } border-2 flex items-center justify-center relative z-10 transition-all duration-300 ${hoveredStep === step.id ? 'border-pink-500 shadow-lg shadow-yellow-500/50' : 'border-pink-600'
                      }`}>
                      <step.icon className={`w-8 h-8 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                    </div>
                    {hoveredStep === step.id && (
                      <motion.div
                        layoutId="hoverBackground"
                        className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Dotted Arrow */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="absolute top-20 left-1/2 w-full flex items-center justify-end pr-2"
                  >
                  </motion.div>
                )}

                {/* Content */}
                <motion.div
                  className="text-center text-xl sm:text-2xl font-bold text-gray-700 mb-4 text-center"
                  animate={{
                    y: hoveredStep === step.id ? -5 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="">
                    {typeof step.value === "number" ? <CountUp end={step.value} duration={2} /> : step.value}
                  </div>

                  <h3 className="text-sm font-semibold mb-2 relative inline-block">
                    {step.title}
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: hoveredStep === step.id ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed ">
                    {step.description}
                  </p>
                </motion.div>
              </motion.a>
            ))}
          </div>
        </div>

        {/*  Tablet View (3-column grid, same as mobile+tablet UI) */}
        <div className="hidden sm:grid md:grid-cols-3 sm:grid-cols-2 gap-6 lg:hidden">
          {steps.map((step) => (
            <motion.a
              key={step.id}
              href={step.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`block p-6 rounded-xl transition-all duration-300 border-1 hover:shadow-xl border-gray-500
                ${isDarkMode ? 'bg-transparent' : 'bg-gradient-to-br from-gray-600 to-gray-900'} 
                hover:border-pink-500/50`}

            // className=" to-gray-900 border border-gray-700 hover:border-pink-500/50 transition-all duration-300. `${}`"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-pink-600 flex items-center justify-center mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-xl font-bold mb-2 text-rose-500 dark:text-white">
                  {typeof step.value === "number" ? <CountUp end={step.value} duration={2} /> : step.value}
                </div>
                <h3 className="text-lg font-semibold mb-1 text-white">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.description}</p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* 📱 Mobile View (list-style, same as your original mobile UI) */}
        <div className="space-y-6 sm:hidden">
          {steps.map((step) => (
            <motion.a
              key={step.id}
              href={step.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              whileTap={{ scale: 0.98 }}
              className="block p-6 rounded-xl bg-gradient-to-br from-gray-600 to-gray-900 border border-gray-800 hover:border-pink-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-pink-600 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold mb-1 text-white">
                    {typeof step.value === "number" ? <CountUp end={step.value} duration={2} /> : step.value}
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>


      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="mt-12 sm:mt-16 text-center text-white "
      >
        <a
          href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(234, 179, 8, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          className='bg-gradient-to-br from-pink-600 to-pink-900 px-4 py-4 rounded-xl'
          >
          View on GitHub
         
        </a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-6 text-gray-400 text-sm flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
          Try hovering over the stats to see details
          <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
        </motion.p>
      </motion.div>
    </div>
  );
}