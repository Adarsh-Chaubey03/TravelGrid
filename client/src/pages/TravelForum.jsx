import React, { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

const forumData = [
  {
    id: 1,
    title: "Best time to visit Himachal?",
    description: "Planning a trip to Himachal. What’s the best season to go?",
    replies: [
      "March to June is ideal if you want pleasant weather.",
      "I visited in October and it was beautiful and less crowded!",
    ],
  },
  {
    id: 2,
    title: "Budget trip to Goa",
    description: "Any recommendations for budget-friendly stays in Goa?",
    replies: [
      "Check out Zostel or Hosteller – affordable and clean.",
      "You can also stay near Anjuna beach for cheap guesthouses.",
    ],
  },
  {
    id: 3,
    title: "Hidden gems in Kerala",
    description: "Share some offbeat places to explore in Kerala.",
    replies: [
      "Try Vagamon – it’s quiet and green.",
      "I’d recommend Aranmula and Thenmala too!",
    ],
  },
  {
    id: 4,
    title: "Best travel backpack?",
    description: "Looking for a lightweight, durable backpack for 1-week trips.",
    replies: [
      "Wildcraft and Quechua are both great options.",
      "Make sure it has good back support and rain cover.",
    ],
  },
];

export default function TravelForum() {
  const [openReplies, setOpenReplies] = useState({});

  const toggleReplies = (id) => {
    setOpenReplies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 lg:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-900 mb-2 mt-2.5">Travel Forum</h1>
          <p className="text-gray-600 text-lg">
            Ask questions, share advice, and connect with travel lovers like you!
          </p>
        </div>

        {forumData.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-md p-6 transition hover:shadow-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-1 text-blue-800">
                  {post.title}
                </h2>
                <p className="text-gray-600">{post.description}</p>
              </div>
              <div
                className="flex items-center gap-2 text-gray-500 cursor-pointer"
                onClick={() => toggleReplies(post.id)}
              >
                <MessageCircle className="w-5 h-5" />
                {post.replies.length}
                {openReplies[post.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>

            {openReplies[post.id] && (
              <div className="mt-4 border-t pt-3 space-y-2">
                {post.replies.map((reply, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md"
                  >
                    💬 {reply}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-center mt-10">
          <button
            onClick={() => toast.error("Feature coming soon")}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition duration-300"
          >
            + Ask a New Question
          </button>
        </div>
      </div>
    </div>
  );
}
