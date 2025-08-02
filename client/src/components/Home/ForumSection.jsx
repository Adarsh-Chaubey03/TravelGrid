import React from "react";
import { useNavigate } from "react-router-dom";

const topics = [
  {
    title: "Best travel hacks for solo travelers",
    replies: 23,
    tag: "Tips & Tricks",
    tagColor: "from-green-400 to-blue-500",
  },
  {
    title: "How to plan a budget-friendly trip to Leh",
    replies: 15,
    tag: "Destinations",
    tagColor: "from-pink-400 to-purple-500",
  },
  {
    title: "Top 5 underrated places in South India",
    replies: 9,
    tag: "Hidden Gems",
    tagColor: "from-yellow-400 to-red-500",
  },
];

const ForumSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-br from-amber-900 via-zinc-900 to-neutral-950 py-16 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
        Join the Conversation
      </h2>
      <p className="text-white/80 text-base md:text-lg mb-12 px-4 max-w-2xl mx-auto">
        Connect with fellow travelers, ask questions, and share your experiences in our buzzing travel community!
      </p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 text-left">
        {topics.map((topic, index) => (
          <div
            key={index}
            className="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 relative text-white"
          >
            <div
              className={`absolute -top-4 left-4 text-xs font-semibold text-white px-3 py-1 rounded-full bg-gradient-to-r ${topic.tagColor} shadow-lg`}
            >
              {topic.tag}
            </div>
            <h3 className="text-lg font-semibold mt-6 mb-3 group-hover:text-pink-300 transition-colors duration-300">
              {topic.title}
            </h3>
            <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
              {topic.replies} replies
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <button
          onClick={() => navigate("/forum")}
          className="py-3 px-8 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition duration-300 cursor-pointer"
        >
          Visit Forum
        </button>
      </div>
    </section>
  );
};

export default ForumSection;
