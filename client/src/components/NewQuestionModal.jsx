import React, { useState } from "react";
import {
  X,
  MessageSquare,
  FileText,
  Send,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const NewQuestionModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    tagColor: "white",
    senderName: user?.name || "",
    postType: "experience",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Please enter a question title";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title should be at least 10 characters long";
    } else if (formData.title.length > 150) {
      newErrors.title = "Title should not exceed 150 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please provide a description";
    } else if (formData.description.length < 20) {
      newErrors.description =
        "Description should be at least 20 characters long";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description should not exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(errors)[0];
      if (firstError) toast.error(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim(),

        category: formData.category,
        postType: formData.postType,
        tagColor: "#FF6347",
        senderName: formData.senderName,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        tagColor: "white",
        senderName: user?.name || "",
        postType: "experience",
      });
      setErrors({});

      toast.success("Question posted successfully! 🎉");
      onClose();
    } catch (error) {
      toast.error("Failed to post question. Please try again.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (formData.title.trim() || formData.description.trim()) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        setFormData({ title: "", description: "", category: "general" });
        setErrors({});
        onClose();
      }
    } else {
      onClose();
    }
  };

  const getCategoryData = (value) => {
    return categories.find((cat) => cat.value === value) || categories[0];
  };

  const selectedCategory = getCategoryData(formData.category);

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .glassmorphism-modal {
          backdrop-filter: blur(20px);
          background: ${isDarkMode
            ? "rgba(15, 23, 42, 0.95)"
            : "rgba(255, 255, 255, 0.95)"};
          border: 1px solid
            ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
        }

        .input-glow:focus-within {
          box-shadow: 0 0 0 3px
            ${isDarkMode
              ? "rgba(236, 72, 153, 0.3)"
              : "rgba(59, 130, 246, 0.3)"};
        }

        .category-badge {
          background: linear-gradient(
            135deg,
            ${selectedCategory.color.replace("from-", "").replace("to-", ", ")}
          );
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"},
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode
            ? "rgba(236, 72, 153, 0.6) rgba(55, 65, 81, 0.3)"
            : "rgba(59, 130, 246, 0.6) rgba(229, 231, 235, 0.5)"};
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode
            ? "rgba(55, 65, 81, 0.3)"
            : "rgba(229, 231, 235, 0.5)"};
          border-radius: 12px;
          margin: 8px 0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            ${isDarkMode
              ? "rgba(236, 72, 153, 0.8), rgba(147, 51, 234, 0.8)"
              : "rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8)"}
          );
          border-radius: 12px;
          border: 1px solid
            ${isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.8)"};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            ${isDarkMode
              ? "rgba(236, 72, 153, 1), rgba(147, 51, 234, 1)"
              : "rgba(59, 130, 246, 1), rgba(147, 51, 234, 1)"}
          );
          box-shadow: 0 0 8px
            ${isDarkMode
              ? "rgba(236, 72, 153, 0.5)"
              : "rgba(59, 130, 246, 0.5)"};
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(
            180deg,
            ${isDarkMode
              ? "rgba(219, 39, 119, 1), rgba(126, 34, 206, 1)"
              : "rgba(37, 99, 235, 1), rgba(126, 34, 206, 1)"}
          );
        }

        /* Scrollbar corner */
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Hide scrollbar for textarea when not needed */
        .textarea-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .textarea-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode
            ? "rgba(55, 65, 81, 0.2)"
            : "rgba(229, 231, 235, 0.3)"};
          border-radius: 8px;
        }

        .textarea-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode
            ? "rgba(156, 163, 175, 0.5)"
            : "rgba(107, 114, 128, 0.5)"};
          border-radius: 8px;
        }

        .textarea-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode
            ? "rgba(156, 163, 175, 0.8)"
            : "rgba(107, 114, 128, 0.8)"};
        }
      `}</style>

      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div
          className={`glassmorphism-modal rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden transform transition-all duration-300 ${
            isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 px-8 py-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-blue-600/20 shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      Ask a New Question Or Share Your Experience
                    </h2>
                    <p className="text-pink-100 text-sm">
                      Share your travel question/experience with the community
                    </p>
                  </div>
                </div>
                <button aria-label="Search"
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110"
                  disabled={isSubmitting}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Category Badge */}
              <div className="flex items-center gap-3 mt-4">
                <span className="text-sm text-pink-100">Category:</span>
                <div
                  className={`category-badge px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg`}
                >
                  <span className="text-lg">{selectedCategory.icon}</span>
                  {selectedCategory.label}
                </div>
              </div>
            </div>
          </div>

          {/* Form with Custom Scrollbar */}
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-8 max-h-[calc(95vh-200px)] overflow-y-auto custom-scrollbar"
          >
            {/* Type Section */}
            <div className="space-y-3">
              <label
                className={`block text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Sparkles className="inline w-5 h-5 mr-2 text-purple-500" />
                Post Type
              </label>
              <select
                name="postType"
                value={formData.postType}
                onChange={handleChange}
                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none text-lg font-medium ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white focus:border-pink-500"
                    : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
                }`}
                disabled={isSubmitting}
              >
                <option value="question">Question</option>
                <option value="experience">Experience</option>
              </select>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label
                className={`block text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Sparkles className="inline w-5 h-5 mr-2 text-purple-500" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none text-lg font-medium ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-600 text-white focus:border-pink-500"
                    : "bg-white border-gray-200 text-gray-900 focus:border-blue-500"
                }`}
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    className={isDarkMode ? "bg-gray-800" : "bg-white"}
                  >
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <label
                className={`block text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Question Title *
              </label>
              <div
                className={`relative input-glow rounded-2xl transition-all duration-300 ${
                  errors.title ? "ring-2 ring-red-500" : ""
                }`}
              >
                <FileText
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="What's your travel question? (e.g., Best time to visit Japan?)"
                  className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none text-lg ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } ${errors.title ? "border-red-500" : ""}`}
                  maxLength={150}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {errors.title && (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-500 text-sm font-medium">
                        {errors.title}
                      </p>
                    </>
                  )}
                  {!errors.title && (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Be specific and descriptive
                    </p>
                  )}
                </div>
                <p
                  className={`text-sm font-medium ${
                    formData.title.length > 130
                      ? "text-red-500"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {formData.title.length}/150
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label
                className={`block text-lg font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Description *
              </label>
              <div
                className={`relative input-glow rounded-2xl transition-all duration-300 ${
                  errors.description ? "ring-2 ring-red-500" : ""
                }`}
              >
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide more details about your question. Include context like destination, budget, travel dates, or specific concerns..."
                  rows={6}
                  className={`w-full px-6 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none resize-none text-lg leading-relaxed textarea-scrollbar ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  } ${errors.description ? "border-red-500" : ""}`}
                  maxLength={1000}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {errors.description && (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-500 text-sm font-medium">
                        {errors.description}
                      </p>
                    </>
                  )}
                  {!errors.description && (
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      The more details you provide, the better answers you'll
                      receive
                    </p>
                  )}
                </div>
                <p
                  className={`text-sm font-medium ${
                    formData.description.length > 900
                      ? "text-red-500"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {formData.description.length}/1000
                </p>
              </div>
            </div>

            {/* Guidelines */}
            <div
              className={`rounded-2xl p-6 border-2 ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-600/30"
                  : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2 rounded-lg ${
                    isDarkMode ? "bg-purple-600/20" : "bg-purple-100"
                  }`}
                >
                  <Sparkles
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                </div>
                <h4
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-purple-300" : "text-purple-800"
                  }`}
                >
                  Community Guidelines
                </h4>
              </div>
              <ul
                className={`space-y-2 text-sm ${
                  isDarkMode ? "text-purple-200" : "text-purple-700"
                }`}
              >
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex-shrink-0"></span>
                  Be respectful and courteous to other travelers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex-shrink-0"></span>
                  Provide specific details to get better answers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex-shrink-0"></span>
                  Search existing questions before posting
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex-shrink-0"></span>
                  Use clear and descriptive titles
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div
              className="flex gap-4 pt-6 border-t-2"
              style={{
                borderColor: isDarkMode ? "#374151" : "#e5e7eb",
              }}
            >
              <button aria-label="Search"
                type="button"
                onClick={handleClose}
                className={`flex-1 px-8 py-4 border-2 font-bold rounded-2xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button aria-label="Search"
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.title.trim() ||
                  !formData.description.trim()
                }
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Post Question
                  </>
                )}
              </button>
            </div>

            {/* Scroll Indicator */}
            <div
              className={`text-center text-xs ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              } pb-2`}
            >
              ↕ Scroll to see more
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewQuestionModal;
