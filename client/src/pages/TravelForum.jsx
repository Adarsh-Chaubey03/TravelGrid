import React, { useState, useEffect, useMemo } from "react";
import {
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  User,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import NewQuestionModal from "../components/NewQuestionModal";
import { useAuth } from "@/context/AuthContext";

const initialForumTopics = [
  {
    id: 1,
    title: "Best travel hacks for solo travelers",
    description:
      "Share your favorite tips for solo adventures and make the most of your solo travel experience.",
    category: "solo",
    author: "TravelExplorer",
    createdAt: "2024-01-15",
    replies: [
      {
        senderName: "Alice",
        message: "Always keep digital copies of your documents.",
        createdAt: "2025-07-28T18:13:22.155Z",
        _id: "reply1",
      },
      {
        senderName: "Bob",
        message: "Pack light and use a universal adapter.",
        createdAt: "2025-07-29T12:20:10.000Z",
        _id: "reply2",
      },
    ],
    views: 234,
    postType: "experience",
    trending: true,
  },
  {
    id: 2,
    title: "How to plan a budget-friendly trip to Leh",
    description:
      "Looking for affordable travel and stay options for exploring the beautiful landscapes of Leh Ladakh.",
    category: "budget",
    author: "BudgetBackpacker",
    createdAt: "2024-01-10",
    replies: [
      "Travel by bus and stay in hostels for best rates.",
      "Book flights early and try local guesthouses.",
    ],
    views: 189,
    postType: "experience",
    trending: false,
  },
  {
    id: 3,
    title: "Top 5 underrated places in South India",
    description:
      "Suggest hidden gems for my next trip that are off the beaten path and perfect for authentic experiences.",
    category: "destinations",
    author: "SouthIndiaLover",
    createdAt: "2024-01-08",
    replies: [
      "Try Chettinad, Hampi, and Gokarna.",
      "Araku Valley and Yercaud are beautiful too!",
    ],
    views: 156,
    postType: "experience",
    trending: true,
  },
  // adding more questions related to new topics
  {
    id: 4,
    title: "Best hotels in Mumbai for business travelers",
    description:
      "Looking for recommendations for hotels with good wifi, conference rooms, and central location in Mumbai.",
    category: "accommodation",
    author: "BusinessNomad",
    createdAt: "2024-01-12",
    replies: [
      {
        senderName: "TravelPro",
        message: "Try The Taj Mahal Palace or The Oberoi for luxury options.",
        createdAt: "2025-07-28T10:15:00.000Z",
        _id: "reply3",
      },
    ],
    views: 145,
    postType: "question",
    trending: false,
  },
  {
    id: 5,
    title: "Flight vs train: Delhi to Goa comparison",
    description:
      "Weighing options between flight and train for Delhi to Goa journey. What are the pros and cons?",
    category: "transport",
    author: "RouteExplorer",
    createdAt: "2024-01-09",
    replies: [],
    views: 98,
    postType: "question",
    trending: false,
  },
  {
    id: 6,
    title: "Street food safety tips for India",
    description:
      "First time traveling to India. What are the best practices for trying street food safely?",
    category: "food",
    author: "FoodieBackpacker",
    createdAt: "2024-01-14",
    replies: [
      {
        senderName: "IndiaExpert",
        message:
          "Stick to busy stalls, avoid raw vegetables, and carry hand sanitizer.",
        createdAt: "2025-07-29T14:30:00.000Z",
        _id: "reply4",
      },
    ],
    views: 203,
    postType: "tips",
    trending: true,
  },
  {
    id: 7,
    title: "Essential travel apps and tools",
    description:
      "Share your favorite apps and digital tools that make traveling easier and more organized.",
    category: "tips",
    author: "TechTraveler",
    createdAt: "2024-01-11",
    replies: [],
    views: 167,
    postType: "tips",
    trending: false,
  },
  {
    id: 8,
    title: "Hidden gems around Rishikesh",
    description:
      "Planning a spiritual journey to Rishikesh. Any lesser-known places worth visiting nearby?",
    category: "destinations",
    author: "SpiritSeeker",
    createdAt: "2024-01-13",
    replies: [
      {
        senderName: "YogaLover",
        message:
          "Visit Kunjapuri Temple for sunrise and Beatles Ashram for history.",
        createdAt: "2025-07-30T08:45:00.000Z",
        _id: "reply5",
      },
    ],
    views: 134,
    postType: "question",
    trending: false,
  },
  {
    id: 9,
    title: "Backpacking Southeast Asia: Complete guide",
    description:
      "Comprehensive guide for first-time backpackers in Southeast Asia covering routes, budget, and essential tips.",
    category: "general",
    author: "BackpackGuru",
    createdAt: "2024-01-07",
    replies: [],
    views: 312,
    postType: "experience",
    trending: true,
  },
];

export default function Forum() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [forumTopics, setForumTopics] = useState(initialForumTopics);

  const [openReplies, setOpenReplies] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [addReply, setAddReply] = useState({
    senderName: user?.name || "",
    message: "",
  });
  const [reply, setReply] = useState(false);
  const [replyPostId, setReplyPostId] = useState(null);

  // Define the data fetching logic in its own function
  const fetchForumTopics = async () => {
    try {
      // Add error handling for network issues
      const fetchForumTopics = async () => {
        try {
          const res = await axios.get(
            "http://localhost:5000/api/post/allPosts",
            {
              timeout: 10000, // 10 second timeout
            }
          );
          // ... rest of your code
        } catch (err) {
          console.error("Failed to load forum topics:", err);
          if (
            err.code === "ECONNREFUSED" ||
            err.message.includes("Network Error")
          ) {
            toast.error(
              "Unable to connect to server. Please check if the backend is running on port 5000."
            );
          } else {
            toast.error("Failed to fetch forum topics");
          }
        }
      };
      const transformed = res.data.map((post) => ({
        id: post._id,
        title: post.title,
        description: post.info,
        category: post.tag?.toLowerCase() || "general",
        author: post.senderName,
        createdAt: post.createdAt,
        replies: post.replies || [],
        views: post.views || 0,
        trending: post.trending || false,
      }));
      setForumTopics(transformed);
    } catch (err) {
      console.error("Failed to load forum topics:", err);
      toast.error("Failed to fetch forum topics");
    }
  };

  useEffect(() => {
    fetchForumTopics();
  }, []);

  const categories = [
    {
      value: "all",
      label: "All Categories",
      icon: "🌍",
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "general",
      label: "General Travel",
      icon: "🌍",
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "destinations",
      label: "Destinations",
      icon: "📍",
      color: "from-pink-500 to-rose-500",
    },
    {
      value: "budget",
      label: "Budget Travel",
      icon: "💰",
      color: "from-yellow-500 to-orange-500",
    },
    {
      value: "solo",
      label: "Solo Travel",
      icon: "🎒",
      color: "from-purple-500 to-violet-500",
    },
    {
      value: "tips",
      label: "Tips & Hacks",
      icon: "💡",
      color: "from-indigo-500 to-blue-500",
    },
    {
      value: "accommodation",
      label: "Hotels & Stay",
      icon: "🏨",
      color: "from-teal-500 to-cyan-500",
    },
    {
      value: "transport",
      label: "Transportation",
      icon: "✈️",
      color: "from-red-500 to-pink-500",
    },
    {
      value: "food",
      label: "Food & Culture",
      icon: "🍜",
      color: "from-amber-500 to-yellow-500",
    },
  ];

  const toggleReplies = (id) => {
    setOpenReplies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // const handleNewQuestion = (questionData) => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       const newQuestion = {
  //         id: Date.now(),
  //         title: questionData.title,
  //         description: questionData.description,
  //         category: questionData.category,
  //         author: "CurrentUser",
  //         createdAt: new Date().toISOString().split("T")[0],
  //         replies: [],
  //         views: 0,
  //         trending: false,
  //       };

  //       setForumTopics((prev) => [newQuestion, ...prev]);

  //       setTimeout(() => {
  //         const newQuestionElement = document.querySelector(
  //           `[data-topic-id="${newQuestion.id}"]`
  //         );
  //         if (newQuestionElement) {
  //           newQuestionElement.scrollIntoView({
  //             behavior: "smooth",
  //             block: "center",
  //           });
  //           newQuestionElement.classList.add("highlight-new-question");
  //           setTimeout(() => {
  //             newQuestionElement.classList.remove("highlight-new-question");
  //           }, 3000);
  //         }
  //       }, 100);

  //       resolve();
  //     }, 1000);
  //   });
  // };

  const handleNewQuestion2 = async (questionData) => {
    const postPayload = {
      title: questionData.title,
      info: questionData.description, // mapping `description` to `info`
      tag: questionData.category, // mapping `category` to `tag`
      tagColor: "#FF6347", // use fixed or dynamic value
      senderName: user?.name, // replace with actual user if available
      postType: questionData.postType, // adjust as needed
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/post/createPost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(postPayload),
        }
      );

      if (!response) throw new Error("Failed to post");

      const data = await response.json();

      console.log("API response:", data);

      if (!response.ok || !data.post) {
        throw new Error("Failed to create post: Invalid response");
      }

      const newQuestion2 = data.post;
      // adjust depending on response structure

      const newQuestion = {
        id: newQuestion2._id,
        title: newQuestion2.title,
        description: newQuestion2.info,
        category: newQuestion2.tag,
        author: user?.name,
        createdAt: newQuestion2.createdAt,
        replies: newQuestion2.replies,
        postType: newQuestion2.postType,
        views: 0,
        trending: false,
      };

      setForumTopics((prev) => [newQuestion, ...prev]);

      if (newQuestion.category) {
        setSelectedCategory(newQuestion.category);
      }

      // Optional scroll-to effect
      setTimeout(() => {
        const newQuestionElement = document.querySelector(
          `[data-topic-id="${newQuestion._id}"]`
        );
        if (newQuestionElement) {
          newQuestionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          newQuestionElement.classList.add("highlight-new-question");
          setTimeout(() => {
            newQuestionElement.classList.remove("highlight-new-question");
          }, 3000);
        }
      }, 100);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post. Please try again.");
    }
  };

  const getCategoryData = (category) => {
    return categories.find((c) => c.value === category) || categories[0];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const sortTopics2 = (topics) => {
    switch (sortBy) {
      case "newest":
        return [...topics].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return [...topics].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "mostReplies":
        return [...topics].sort((a, b) => b.replies.length - a.replies.length);
      case "trending":
        return [...topics].sort((a, b) => {
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return b.views - a.views;
        });
      default:
        return topics;
    }
  };

  const filteredAndSortedTopics = useMemo(() => {
    let filteredTopics = forumTopics;

    // 1. Filter by selected category
    if (selectedCategory !== "all") {
      // comparing directly with the category value instead of label
      filteredTopics = filteredTopics.filter(
        (topic) => topic.category === selectedCategory
      );
    }

    // 2. Filter by search query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filteredTopics = filteredTopics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(lowercasedQuery) ||
          topic.description.toLowerCase().includes(lowercasedQuery) ||
          topic.author.toLowerCase().includes(lowercasedQuery)
      );
    }

    // 3. Sort the topics (example: by date)
    const sortedTopics = sortTopics2(filteredTopics);

    return sortedTopics;
  }, [forumTopics, selectedCategory, searchQuery, sortBy]);

  //handleReply
  const handleReply = (id) => {
    setReply(true);
    setReplyPostId(id);
  };
  const handleReplyChange = (e) => {
    e.preventDefault();
    setAddReply({ ...addReply, [e.target.name]: e.target.value });
  };
  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!addReply?.message) {
      toast.error("Please enter a message to reply");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/post/reply/${replyPostId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ This is required for cookies to be sent
          body: JSON.stringify(addReply),
        }
      );

      const data = await res.json();
      if (res.ok) {
        fetchForumTopics();

        // Reset state
        setAddReply({ senderName: user?.name, message: "" });
        setReplyPostId(null);
        toast.success("Reply added successfully!");
      } else {
        toast.error(data.message || "Failed to add reply");
      }
    } catch (e) {
      toast.error("Something went wrong!");
    }
  };
  const selectClasses = `
    flex-grow py-3 px-4 rounded-2xl border-2 appearance-none 
    transition-all duration-300 focus:outline-none cursor-pointer
    ${
      isDarkMode
        ? "bg-gray-800 border-gray-600 text-white focus:border-pink-500"
        : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
    }
  `;
  // Tailwind classes for the SVG icon wrapper
  const svgWrapperClasses = `
    p-3 rounded-2xl flex items-center justify-center 
    ${
      isDarkMode
        ? "bg-gray-800 border border-gray-600"
        : "bg-gray-50 border border-gray-200"
    }
    text-gray-500 transition-colors duration-300
  `;

  return (
    <>
      <style>{`
        .highlight-new-question {
          animation: highlight 3s ease-in-out;
        }
        
        @keyframes highlight {
          0% { 
            background-color: ${
              isDarkMode ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"
            }; 
            transform: scale(1.02); 
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
          }
          50% { 
            background-color: ${
              isDarkMode ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"
            }; 
          }
          100% { 
            background-color: transparent; 
            transform: scale(1); 
            box-shadow: none;
          }
        }

        .glassmorphism {
          backdrop-filter: blur(12px);
          background: ${
            isDarkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)"
          };
          border: 1px solid ${
            isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.3)"
          };
        }

        .search-glow:focus-within {
          box-shadow: 0 0 0 3px ${
            isDarkMode ? "rgba(236, 72, 153, 0.3)" : "rgba(59, 130, 246, 0.3)"
          };
        }

        .category-gradient-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div
        className={`min-h-screen mt-20 transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-black to-pink-900"
            : "bg-gradient-to-br from-pink-200/50 via-white/70 to-blue-200/50"
        } p-4 lg:p-8`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Header Section */}
          <div className="text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div
                className={`w-full h-full bg-gradient-to-r ${
                  isDarkMode
                    ? "from-pink-500 via-purple-500 to-blue-500"
                    : "from-blue-500 via-purple-500 to-pink-500"
                }`}
              />
            </div>
            <div className="relative z-10 py-12">
              <h1
                className={`text-4xl md:text-6xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Travel{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                  Forum
                </span>
              </h1>
              <p
                className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Connect with fellow travelers, share experiences, and discover
                insider tips from a community of passionate explorers around the
                globe.
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div
            className={`flex-grow glassmorphism rounded-3xl p-6 shadow-xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex flex-grow lg:flex-row gap-6">
              {/* Search Bar */}
              <div className="flex-1">
                <div
                  className={`relative search-glow rounded-2xl transition-all duration-300 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <Search
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search discussions, topics, or authors..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="lg:w-96 max-w-full">
                <div className="flex items-end space-x-3 w-full">
                  {/* 1. SVG Icon Container */}
                  <div className={svgWrapperClasses} aria-hidden="true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-funnel w-6 h-6"
                    >
                      <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"></path>
                    </svg>
                  </div>

                  {/* 2. Select Dropdown Container */}
                  <div className="relative flex-grow">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={selectClasses}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="mostReplies">Most Replies</option>
                      <option value="trending">Trending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats and Actions Bar */}
          <div
            className={`glassmorphism rounded-3xl p-6 shadow-xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
                    {forumTopics.length}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Questions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
                    {forumTopics.reduce(
                      (acc, topic) => acc + topic.replies.length,
                      0
                    )}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Replies
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-transparent bg-clip-text">
                    {new Set(forumTopics.map((topic) => topic.author)).size}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Contributors
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Ask a New Question/Experience
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div
            className={`glassmorphism rounded-3xl p-6 shadow-xl border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Browse by Category
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`category-gradient-hover p-4 rounded-2xl text-sm font-medium transition-all duration-300 flex flex-col items-center gap-2 ${
                    selectedCategory === category.value
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                      : isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-xs text-center leading-tight">
                    {category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results Info */}
          {(searchQuery || selectedCategory !== "all") && (
            <div
              className={`text-center py-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <p className="text-lg">
                {filteredAndSortedTopics.length > 0
                  ? `Found ${filteredAndSortedTopics.length} discussion${
                      filteredAndSortedTopics.length !== 1 ? "s" : ""
                    }`
                  : "No discussions found"}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== "all" &&
                  ` in ${getCategoryData(selectedCategory).label}`}
              </p>
            </div>
          )}

          {/* Forum Topics */}
          <div className="space-y-6">
            {filteredAndSortedTopics.length > 0 ? (
              filteredAndSortedTopics.map((topic) => {
                const categoryData = getCategoryData(topic.category);
                return (
                  <div
                    key={topic.id}
                    data-topic-id={topic.id}
                    className={`glassmorphism rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border ${
                      isDarkMode
                        ? "border-gray-700 hover:border-gray-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <span
                              className={`bg-gradient-to-r ${categoryData.color} text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2`}
                            >
                              {categoryData.icon} {categoryData.label}
                            </span>
                            {topic.trending && (
                              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Trending
                              </span>
                            )}
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              <User className="w-4 h-4" />
                              {topic.author}
                            </div>
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              <Calendar className="w-4 h-4" />
                              {formatDate(topic.createdAt)}
                            </div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {topic.views} views
                            </div>
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {topic.postType}
                            </div>
                          </div>
                          <h2
                            className={`text-2xl font-bold mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 transition-all duration-300 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {topic.title}
                          </h2>
                          <p
                            className={`text-lg leading-relaxed ${
                              isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {topic.description}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-3 cursor-pointer transition-all duration-300 ml-6 p-3 rounded-2xl ${
                            isDarkMode
                              ? "text-gray-400 hover:text-pink-400 hover:bg-gray-800"
                              : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                          onClick={() => toggleReplies(topic.id)}
                        >
                          <MessageCircle className="w-6 h-6" />
                          <span className="font-semibold text-lg">
                            {topic.replies.length}
                          </span>
                          {openReplies[topic.id] ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {openReplies[topic.id] && topic.replies.length > 0 && (
                        <div
                          className="mt-8 border-t pt-6 space-y-4"
                          style={{
                            borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                          }}
                        >
                          <h4
                            className={`font-bold text-lg mb-4 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Replies ({topic.replies.length})
                          </h4>

                          {topic.replies.map((reply, idx) => (
                            <div
                              key={reply?._id || idx}
                              className={`p-6 rounded-2xl border ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-700"
                                  : "bg-blue-50 border-blue-100"
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isDarkMode
                                      ? "bg-pink-600 text-white"
                                      : "bg-blue-200 text-blue-800"
                                  }`}
                                >
                                  {idx + 1}
                                </div>
                                <span
                                  className={`font-semibold ${
                                    isDarkMode
                                      ? "text-pink-400"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {reply?.senderName ?? "Unknown"}
                                </span>
                              </div>
                              <p
                                className={`leading-relaxed ${
                                  isDarkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {reply?.message || "Messages"}
                              </p>
                              <p
                                className={`text-sm mt-2 ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {new Date(reply?.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {openReplies[topic.id] && topic.replies.length === 0 && (
                        <div
                          className="mt-8 border-t pt-6"
                          style={{
                            borderColor: isDarkMode ? "#374151" : "#e5e7eb",
                          }}
                        >
                          <p
                            className={`text-center italic text-lg ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            No replies yet. Be the first to help this traveler!
                            🚀
                          </p>
                        </div>
                      )}
                      {replyPostId === topic.id ? (
                        <button
                          onClick={() => setReplyPostId(null)}
                          className=" mt-3 border rounded-lg text-white hover:cursor-pointer hover:scale-105 w-fit p-3 bg-gradient-to-l from-pink-600 to-purple-400"
                        >
                          Close
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReply(topic.id)}
                          className=" mt-3 border rounded-lg text-white hover:cursor-pointer hover:scale-105 w-fit p-3 bg-gradient-to-l from-pink-600 to-purple-400"
                        >
                          Add Reply
                        </button>
                      )}

                      {replyPostId === topic.id && (
                        <>
                          <form onSubmit={handleReplySubmit}>
                            <label
                              htmlFor="message"
                              className={`block text-lg font-bold ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Reply Message*
                            </label>
                            <div
                              className={`relative mt-3 input-glow rounded-2xl transition-all duration-300 
                                }`}
                            >
                              <textarea
                                name="message"
                                value={addReply?.message}
                                onChange={handleReplyChange}
                                placeholder="Enter Your Reply Here"
                                rows={6}
                                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none resize-none text-lg leading-relaxed textarea-scrollbar ${
                                  isDarkMode
                                    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                                }`}
                                maxLength={1000}
                                required
                              />
                            </div>
                            <button
                              type="submit"
                              className=" block mx-auto border rounded-lg text-white hover:cursor-pointer hover:scale-105 w-fit p-3 bg-gradient-to-l from-pink-600 to-purple-400"
                            >
                              Submit
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                className={`glassmorphism rounded-3xl p-16 text-center shadow-xl border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <MessageCircle
                  className={`w-20 h-20 mx-auto mb-6 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {searchQuery
                    ? "No discussions found"
                    : `No questions in ${
                        getCategoryData(selectedCategory).label
                      } yet`}
                </h3>
                <p
                  className={`text-lg mb-8 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {searchQuery
                    ? "Try adjusting your search terms or explore different categories."
                    : `Be the first to start a conversation in ${
                        getCategoryData(selectedCategory).label
                      }!`}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {searchQuery ? "Ask a Question" : "Ask the First Question"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewQuestion2}
      />
    </>
  );
}
