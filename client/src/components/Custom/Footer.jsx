import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { useAuth } from '../store/auth';
import { useTheme } from '../context/ThemeContext';
import { FaBookmark, FaGraduationCap, FaChartLine, FaClock, FaPlay, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import CircularProgressChart from './CircularProgressChart'; // ✅ Added import

// Lazy loaded components
const CardBody = lazy(() => import('../components/CardBody'));
const CourseModules = lazy(() => import('../components/CourseModules'));
const PersonalInfoEdit = lazy(() => import('../components/PersonalInfoEdit'));

function Dashboard() {
  const { userdata, API } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [bookmarks, setBookmarks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  // Stats for user dashboard with proper tracking
  const [stats, setStats] = useState({
    coursesInProgress: 0,
    coursesCompleted: 0,
    totalHoursLearned: 0,
    lastActive: new Date().toISOString(),
    savedCourses: 0,
    savedRoadmaps: 0
  });
  const [courseProgress, setCourseProgress] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseProgress, setSelectedCourseProgress] = useState(null);
  const [activeTab, setActiveTab] = useState('learning');
  const token = localStorage.getItem('token');

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/v1/bookmarks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        const list = data.data || [];
        setBookmarks(list);
        setStats(prev => ({ ...prev, savedRoadmaps: list.length }));
      } else {
        console.error('Failed to fetch bookmarks:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  }, [API, token]);

  // Fetch user's watchlist (Saved Courses) - memoized to prevent unnecessary re-renders
  const fetchWatchlist = useCallback(async () => {
    try {
      //console.log('Fetching user watchlist...');
      const response = await fetch(`${API}/user/watchlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        //console.log('Watchlist data:', data);
        setWatchlist(data.watchlist || []);

        // Update saved courses count in stats
        setStats(prevStats => ({
          ...prevStats,
          savedCourses: data.watchlist ? data.watchlist.length : 0
        }));
      } else {
        console.error('Failed to fetch watchlist:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  }, [API, token]);

  // Fetch user's progress data for Continue Watching and stats - memoized to prevent unnecessary re-renders
  const fetchUserProgress = useCallback(async () => {
    try {
      //console.log('Fetching user progress data...');
      const response = await fetch(`${API}/progress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        //console.log('Progress data:', data);

        // Filter out any invalid progress entries
        const validProgress = data.progress ? data.progress.filter(
          course => course.courseId && typeof course.courseId === 'object'
        ) : [];

        setCourseProgress(validProgress);

        // Calculate stats based on progress
        let inProgress = 0;
        let completed = 0;
        let totalHours = 0;

        validProgress.forEach(course => {
          // Ensure we have valid data
          if (!course.courseId || typeof course.courseId !== 'object') {
            console.warn('Invalid course progress entry:', course);
            return;
          }

          if (course.status === 'in-progress') {
            inProgress++;
          } else if (course.status === 'completed') {
            completed++;
          }

          // Add up total learning hours
          totalHours += course.totalHoursSpent || 0;
        });

        // Update stats with real data
        setStats(prev => ({
          ...prev,
          coursesInProgress: inProgress,
          coursesCompleted: completed,
          totalHoursLearned: Math.round(totalHours)
        }));

        // If there's at least one course in progress, select it for the dashboard
        const inProgressCourses = validProgress.filter(course => course.status === 'in-progress');
        if (inProgressCourses.length > 0) {
          setSelectedCourse(inProgressCourses[0].courseId);
          setSelectedCourseProgress(inProgressCourses[0]);
        } else if (validProgress.length > 0) {
          // Otherwise, select the first course with progress
          const firstCourse = validProgress[0].courseId;
          setSelectedCourse(firstCourse);
          setSelectedCourseProgress(validProgress[0]);
        }
      } else {
        console.error('Failed to fetch progress:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  }, [API, token]);

  // Handle course selection and track the activity - memoized to prevent unnecessary re-renders
  const handleCourseSelect = useCallback(async (course) => {
    //console.log('Course selected:', course);
    setSelectedCourse(course);

    // Find progress for this course
    const progress = courseProgress.find(p => p.courseId._id === course._id);
    setSelectedCourseProgress(progress || null);

  }, [courseProgress]);

  // Handle progress update and store in database - memoized to prevent unnecessary re-renders
  const handleProgressUpdate = useCallback(async (updatedProgress) => {
    //console.log('Progress update received:', updatedProgress);

    // First, update the local state
    setCourseProgress(prev => {
      // Find the course to update or add it if it doesn't exist
      const exists = prev.some(p => p._id === updatedProgress._id);
      const newProgress = exists
        ? prev.map(p => p._id === updatedProgress._id ? updatedProgress : p)
        : [...prev, updatedProgress];

      // Update stats based on new progress data
      let inProgress = 0;
      let completed = 0;
      let totalHours = 0;

      newProgress.forEach(course => {
        if (course.status === 'in-progress') {
          inProgress++;
        } else if (course.status === 'completed') {
          completed++;
        }
        totalHours += course.totalHoursSpent || 0;
      });

      setStats(prev => ({
        ...prev,
        coursesInProgress: inProgress,
        coursesCompleted: completed,
        totalHoursLearned: Math.round(totalHours)
      }));

      return newProgress;
    });

    // Update selected course progress if it's the current course
    if (selectedCourseProgress && selectedCourseProgress._id === updatedProgress._id) {
      setSelectedCourseProgress(updatedProgress);
    }

    // Save the progress to the database
    if (updatedProgress.courseId && token) {
      try {
        //console.log('Saving progress to database...');
        const courseId = typeof updatedProgress.courseId === 'object'
          ? updatedProgress.courseId._id
          : updatedProgress.courseId;

        const response = await fetch(`${API}/progress/${courseId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            progress: updatedProgress.progress || 0,
            currentVideoTime: updatedProgress.currentVideoTime || 0,
            totalHoursSpent: updatedProgress.totalHoursSpent || 0,
            status: updatedProgress.status || 'in-progress'
          })
        });

        if (response.ok) {
          //console.log('Progress saved successfully');
        } else {
          console.error('Failed to save progress:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }, [selectedCourseProgress, token, API]);

  // ✅ NEW: Interactive segment click handler for CircularProgressChart
  const handleSegmentClick = useCallback((segment) => {
    console.log('Segment clicked:', segment);
    
    // Handle different segment clicks with enhanced interactions
    switch(segment.id) {
      case 'completed':
        // Filter to show only completed courses or create a modal
        console.log('Show completed courses');
        // You could create a modal or redirect to filtered view
        alert(`You have completed ${segment.value} courses! 🎉`);
        break;
      case 'inProgress':
        // Scroll to or highlight the continue learning section
        console.log('Show in-progress courses');
        const continueSection = document.querySelector('[data-section="continue-learning"]');
        if (continueSection) {
          continueSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Optionally pulse the continue learning section
        break;
      case 'notStarted':
        // Show available courses to start
        console.log('Show available courses');
        // Redirect to courses page to explore new courses
        window.location.href = '/courses';
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
    fetchWatchlist();
    fetchUserProgress();
  }, [fetchBookmarks, fetchWatchlist, fetchUserProgress]);

  // Handle watchlist update in CardBody - memoized to prevent unnecessary re-renders
  const updateWatchlist = useCallback(async () => {
    // Refresh watchlist data
    await fetchWatchlist();
  }, [fetchWatchlist]);

  // Animation variants - matching Roadmaps
  const backgroundVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

return (
    <div className={`relative min-h-screen-minus-nav overflow-hidden z-10 ${isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-light-bg-primary text-light-text-primary'}`}>
      {/* Enhanced Background with gradient overlay - matching Roadmaps */}
      <motion.div 
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        className={`absolute top-0 left-0 w-full h-full -z-10 bg-[size:30px_30px] ${isDark ? 'bg-grid-pattern-dark' : 'bg-grid-pattern-light'}`}
      >
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-bg-primary/90 via-transparent to-dark-bg-primary/50' : 'bg-gradient-to-br from-light-bg-primary/90 via-transparent to-light-bg-primary/50'}`}></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Enhanced Header Section - matching Roadmaps */}
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <div className="inline-block">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-righteous tracking-wider mb-4 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
              Learning Dashboard
            </h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className={`h-1 rounded-full bg-gradient-to-r ${isDark ? 'from-primary via-primary-dark to-primary' : 'from-primary via-primary-dark to-primary'}`}
            ></motion.div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={`mt-6 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}
          >
            Welcome back, <span className="text-primary font-semibold">{userdata ? userdata.username : "Learner"}</span>! Track your progress and continue your learning journey.
          </motion.p>
        </motion.div>

        {/* Enhanced Stats Cards - matching Roadmaps card style */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {[
            {
              icon: FaStar,
              label: "Saved Roadmaps",
              value: stats.savedRoadmaps,
              color: "text-yellow-500",
              bgColor: "bg-yellow-500/10"
            },
            {
              icon: FaBookmark,
              label: "Saved Courses",
              value: stats.savedCourses,
              color: "text-blue-500",
              bgColor: "bg-blue-500/10"
            },
            {
              icon: FaGraduationCap,
              label: "Completed",
              value: stats.coursesCompleted,
              color: "text-green-500",
              bgColor: "bg-green-500/10"
            },
            {
              icon: FaChartLine,
              label: "In Progress",
              value: stats.coursesInProgress,
              color: "text-orange-500",
              bgColor: "bg-orange-500/10"
            }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariants}
              whileHover="hover"
              className={`group relative p-6 lg:p-8 rounded-2xl shadow-lg flex items-center bg-gradient-to-br transition-all duration-300 overflow-hidden ${
                isDark 
                  ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000 backdrop-blur-xl' 
                  : 'from-blue-50 to-indigo-50 border border-light-border hover:border-primary/50'
              }`}
            >
              {/* Animated border on hover */}
              <motion.div 
                className="absolute top-0 right-0 w-0 h-full bg-primary rounded-r-2xl"
                whileHover={{ 
                  width: "3px",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              />
              <motion.div 
                className="absolute bottom-0 left-0 w-full h-0 bg-primary rounded-b-2xl"
                whileHover={{ 
                  height: "3px",
                  transition: { duration: 0.3, ease: "easeOut", delay: 0.05 }
                }}
              />

              <motion.div 
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl ${stat.bgColor} flex items-center justify-center mr-4`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className={`${stat.color} text-xl sm:text-2xl`} />
              </motion.div>
              
              <div>
                <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                  {stat.label}
                </p>
                <h3 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'} group-hover:text-primary transition-colors duration-300`}>
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Dashboard Content - Clean Tab Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Left Sidebar - Personal Info */}
          <div className="xl:col-span-2">
            <Suspense fallback={
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }} 
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                  className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
              </div>
            }>
              <PersonalInfoEdit />
            </Suspense>
          </div>

          {/* Main Content Area - 3/5 width */}
          <div className="xl:col-span-3">
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-8"
            >
              <div className={`flex space-x-1 p-1 rounded-xl ${isDark ? 'bg-dark-bg-secondary' : 'bg-light-bg-secondary'}`}>
                {[
                  { id: 'learning', label: 'Continue Learning', icon: FaPlay },
                  { id: 'watchlist', label: 'Watchlist', icon: FaBookmark },
                  { id: 'bookmarks', label: 'Bookmarks', icon: FaStar }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md'
                        : `${isDark ? 'text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-bg-tertiary' : 'text-light-text-secondary hover:text-light-text-primary hover:bg-light-bg-tertiary'}`
                    }`}
                  >
                    <tab.icon className="mr-2 text-sm" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'learning' && (
                <div className="space-y-6">
                  {/* ✅ Updated Interactive Circular Progress Chart */}
                  <CircularProgressChart
                    totalCourses={stats.coursesInProgress + stats.coursesCompleted}
                    completedCourses={stats.coursesCompleted}
                    inProgressCourses={stats.coursesInProgress}
                    title="Your Learning Overview"
                    onSegmentClick={handleSegmentClick} // ✅ Added interactive handler
                  />

                  {/* ✅ Added data-section attribute for scroll targeting */}
                  <div className="mb-6" data-section="continue-learning">
                    <h2 className={`text-2xl sm:text-3xl font-righteous tracking-wide ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                      Continue Learning
                    </h2>
                    <p className={`text-sm mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                      Pick up where you left off
                    </p>
                  </div>

                  {selectedCourse ? (
                    <div className="space-y-6">
                      <motion.div 
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.3 }}
                        className={`relative p-6 lg:p-8 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                          isDark 
                            ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
                            : 'from-blue-50 to-indigo-50 border border-light-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className={`text-xl lg:text-2xl font-semibold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                            {selectedCourse.course_title}
                          </h3>
                          <Link
                            to={`/courses/${selectedCourse._id}`}
                            className="py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors text-sm flex items-center font-semibold"
                          >
                            <FaPlay className="mr-2" /> Continue Watching
                          </Link>
                        </div>

                        <div className="flex items-center mb-4">
                          <img
                            src={selectedCourse.course_image || 'https://via.placeholder.com/150'}
                            alt={selectedCourse.course_title}
                            className="w-20 h-20 object-cover rounded-xl mr-4 shadow-md"
                          />
                          <div className="flex-1">
                            <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'} mb-1`}>
                              By {selectedCourse.creator_name}
                            </p>
                            {selectedCourseProgress && (
                              <div className="mt-2">
                                <div className="flex justify-between items-center text-xs mb-2">
                                  <span className={`${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                                    {selectedCourseProgress.progress || 0}% complete
                                  </span>
                                  <span className="flex items-center text-primary">
                                    <FaClock className="mr-1" />
                                    {Math.round(selectedCourseProgress.totalHoursSpent || 0)}h
                                  </span>
                                </div>
                                <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                  <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${selectedCourseProgress.progress || 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      <Suspense fallback={
                        <div className="flex items-center justify-center h-40">
                          <motion.div
                            animate={{ rotate: 360 }} 
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                            className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                          />
                        </div>
                      }>
                        <CourseModules
                          courseId={selectedCourse._id}
                          progress={selectedCourseProgress}
                          onModuleComplete={handleProgressUpdate}
                        />
                      </Suspense>
                    </div>
                  ) : (
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-12 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl text-center transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                        isDark 
                          ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
                          : 'from-blue-50 to-indigo-50 border border-light-border'
                      }`}
                    >
                      <motion.div 
                        className={`w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-primary'}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FaGraduationCap className="text-primary text-3xl" />
                      </motion.div>
                      <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                        No courses in progress
                      </h3>
                      <p className={`mb-6 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        Start learning by adding courses to your watchlist.
                      </p>
                      <Link
                        to="/courses"
                        className="py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors font-semibold"
                      >
                        Explore Courses
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === 'watchlist' && (
                <div className="space-y-6">
                  <div className="mb-6 flex justify-between items-start">
                    <div>
                      <h2 className={`text-2xl sm:text-3xl font-righteous tracking-wide ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                        Your Watchlist
                      </h2>
                      <p className={`text-sm mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        Courses you&apos;ve saved for later
                      </p>
                    </div>
                    <Link
                      to="/courses"
                      className="text-primary hover:text-primary-dark transition-colors font-medium text-sm"
                    >
                      Browse more
                    </Link>
                  </div>

                  {watchlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {watchlist.map(course => (
                        <div key={course._id} className="flex justify-center">
                          <Suspense fallback={
                            <div className="flex items-center justify-center h-40">
                              <motion.div
                                animate={{ rotate: 360 }} 
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                                className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                              />
                            </div>
                          }>
                            <CardBody
                              course={course}
                              watchlist={watchlist}
                              updateWatchlist={updateWatchlist}
                              onClick={handleCourseSelect}
                              size="wide"
                            />
                          </Suspense>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-8 lg:p-12 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl text-center transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                        isDark 
                          ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
                          : 'from-blue-50 to-indigo-50 border border-light-border'
                      }`}
                    >
                      <motion.div 
                        className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-primary'}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FaBookmark className="text-primary text-xl" />
                      </motion.div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                        Your watchlist is empty
                      </h3>
                      <p className={`mb-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        Save courses to watch later and track your learning progress.
                      </p>
                      <Link
                        to="/courses"
                        className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors text-sm font-semibold"
                      >
                        Explore Courses
                      </Link>
                    </motion.div>
                  )}
                </div>

              )}

              {activeTab === 'bookmarks' && (
                <div className="space-y-6">
                  <div className="mb-6 flex justify-between items-center">
                    <div>
                      <h2 className={`text-2xl sm:text-3xl font-righteous tracking-wide ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                        Your Bookmarks
                      </h2>
                      <p className={`text-sm mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        Saved roadmaps for quick access
                      </p>
                    </div>
                    {bookmarks.length > 0 && (
                      <Link
                        to="/bookmarks"
                        className="text-primary hover:text-primary-dark transition-colors font-medium"
                      >
                        View All
                      </Link>
                    )}
                  </div>

                  {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookmarks.map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -6, scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          className={`relative p-6 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                            isDark 
                              ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
                              : 'from-blue-50 to-indigo-50 border border-light-border'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-3xl">{item.icon || "📌"}</span>
                            <FaBookmark className="text-primary" />
                          </div>
                          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                            {item.name}
                          </h3>
                          <p className={`text-sm mb-6 capitalize ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                            {item.type} roadmap
                          </p>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors text-sm font-semibold"
                            >
                              Explore
                            </a>
                          </motion.div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (

                    <motion.div 
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className={`relative p-8 lg:p-12 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl text-center transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                        isDark 
                          ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
                          : 'from-blue-50 to-indigo-50 border border-light-border'
                      }`}
                    >
                      <motion.div 
                        className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${isDark ? 'bg-dark-bg-primary' : 'bg-light-bg-primary'}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FaBookmark className="text-primary text-xl" />
                      </motion.div>
                      <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                        No bookmarks yet
                      </h3>
                      <p className={`mb-4 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                        Save your favorite roadmaps here for quick access.
                      </p>
                      <Link
                        to="/roadmap"
                        className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors text-sm font-semibold"
                      >
                        Explore Roadmaps
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Call to Action Section - refreshed UI */}
        <motion.section 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6, ease: "easeOut" }}
          className={`mt-24 rounded-3xl overflow-hidden border ${
            isDark
              ? 'bg-gradient-to-br from-dark-bg-secondary via-dark-bg-tertiary to-dark-bg-secondary border-dark-border'
              : 'bg-gradient-to-br from-light-bg-secondary via-light-bg-tertiary to-light-bg-secondary border-light-border'
          }`}
        >
          <div
          className={`relative p-6 lg:p-8 rounded-2xl shadow-lg bg-gradient-to-br backdrop-blur-xl transition-all duration-300 hover:shadow-2xl overflow-hidden ${
            isDark 
              ? 'from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-secondary-1000' 
              : 'from-blue-50 to-indigo-50 border border-light-border'
          }`} 
          // className="px-6 py-8 sm:px-10 sm:py-12 md:px-14 md:py-14"
          >
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left - Message */}
              <div className="md:col-span-2 text-center md:text-left">
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-righteous leading-tight ${
                  isDark ? 'text-dark-text-primary' : 'text-light-text-primary'
                }`}>
                  Keep Learning,
                  <span className="text-primary"> Keep Growing</span>
                </h3>
                <p className={`mt-3 sm:mt-4 text-base sm:text-lg md:text-xl ${
                  isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'
                }`}>
                  Set goals, track your progress, and turn consistency into mastery.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                  <Link to="/courses" className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors text-sm sm:text-base">
                    Browse Courses
                  </Link>
                  <Link to="/roadmap" className={`${
                    isDark ? 'bg-dark-bg-primary text-dark-text-primary' : 'bg-light-bg-primary text-light-text-primary'
                  } px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-primary/30 hover:border-primary/60 transition-colors text-sm sm:text-base`}>
                    Explore Roadmaps
                  </Link>
                </div>
              </div>

              {/* Right - Quick Stats */}
              <div className={`rounded-2xl p-5 sm:p-6 border ${
                isDark ? 'bg-dark-bg-primary/60 border-dark-border' : 'bg-light-bg-primary/60 border-light-border'
              }`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm opacity-70">Saved Courses</div>
                    <div className="text-xl sm:text-2xl font-semibold text-primary">{stats.savedCourses}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm opacity-70">Saved Roadmaps</div>
                    <div className="text-xl sm:text-2xl font-semibold text-primary">{stats.savedRoadmaps}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm opacity-70">In Progress</div>
                    <div className="text-xl sm:text-2xl font-semibold">{stats.coursesInProgress}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs sm:text-sm opacity-70">Hours</div>
                    <div className="text-xl sm:text-2xl font-semibold">{stats.totalHoursLearned}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

export default Dashboard;