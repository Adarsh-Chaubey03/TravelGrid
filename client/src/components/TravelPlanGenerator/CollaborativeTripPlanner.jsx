import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Send,
  MousePointer,
  UserPlus,
  Link,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import useCollaboration from "../../hooks/useCollaboration";
import * as collaborationService from "../../services/collaborationService";

const CollaborativeTripPlanner = ({ trip, user, onTripUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [collaborationToken, setCollaborationToken] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(trip?.isCollaborative || false);
  const messagesEndRef = useRef(null);

  // Use collaboration hook
  const {
    isConnected,
    collaborators,
    cursorPositions,
    error,
    sendCursorMove,
    sendTripUpdate,
    sendMessage
  } = useCollaboration(trip?._id, user);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize collaboration token if trip is already collaborative
    if (trip && trip.collaborationToken) {
      setCollaborationToken(trip.collaborationToken);
      setIsCollaborative(true);
    }
  }, [trip]);

  const handleMouseMove = (e) => {
    if (trip) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      sendCursorMove({ x, y });
    }
  };

  const handleTripUpdate = (updates) => {
    if (trip && user) {
      sendTripUpdate(updates);
      // Also update locally
      if (onTripUpdate) {
        onTripUpdate(updates);
      }
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && trip && user) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const enableCollaboration = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await collaborationService.enableCollaboration(trip._id, token);
      
      setIsCollaborative(true);
      setCollaborationToken(response.collaborationToken);
      toast.success("Collaboration enabled successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to enable collaboration");
    }
  };

  const copyCollaborationLink = () => {
    const link = `${window.location.origin}/collaborate/${collaborationToken}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!trip || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Collaboration Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          <h2 className="text-xl font-semibold">Collaborative Trip Planning</h2>
          {!isConnected && (
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Disconnected
            </span>
          )}
        </div>
        {!isCollaborative ? (
          <button
            onClick={enableCollaboration}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Enable Collaboration
          </button>
        ) : (
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Link className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">Collaboration Link:</span>
            </div>
            <button
              onClick={copyCollaborationLink}
              className="flex items-center px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                  <span className="text-sm">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  <span className="text-sm">Copy Link</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Planning Area */}
        <div
          className="flex-1 relative overflow-auto"
          onMouseMove={handleMouseMove}
        >
          {/* Render trip content here */}
          <div className="p-4">
            <h3 className="text-lg font-medium mb-2">{trip.destination}</h3>
            <p className="text-gray-600 mb-4">
              {trip.numberOfDays} days starting on {trip.startDate}
            </p>
            
            {/* Plan details */}
            {trip.plan && trip.plan.days && (
              <div className="space-y-4">
                {trip.plan.days.map((day) => (
                  <div key={day.day} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Day {day.day}: {day.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Activities</h5>
                        <ul className="list-disc list-inside">
                          {day.activities.map((activity, idx) => (
                            <li key={idx} className="text-sm">{activity}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Meals</h5>
                        <ul className="text-sm space-y-1">
                          <li>Breakfast: {day.meals.breakfast}</li>
                          <li>Lunch: {day.meals.lunch}</li>
                          <li>Dinner: {day.meals.dinner}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Collaborator cursors */}
          {Object.entries(cursorPositions).map(([socketId, position]) => {
            const collaborator = collaborators.find((c) => c.socketId === socketId);
            if (!collaborator) return null;

            return (
              <div
                key={socketId}
                className="absolute pointer-events-none"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="flex items-center">
                  <MousePointer className="w-4 h-4 text-blue-500" />
                  <span className="ml-1 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                    {collaborator.username}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar with collaborators and chat */}
        <div className="w-80 border-l flex flex-col">
          {/* Collaborators List */}
          <div className="p-4 border-b">
            <h3 className="font-medium mb-2 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Collaborators ({collaborators.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.socketId}
                  className="flex items-center p-2 bg-gray-50 rounded"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                    {collaborator.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{collaborator.username}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h3 className="font-medium flex items-center">
                <span className="mr-2">Chat</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {messages.length}
                </span>
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet</p>
              ) : (
                messages.map((message, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center mb-1">
                      <span className="font-medium mr-2">{message.username}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="bg-gray-100 p-2 rounded">{message.message}</p>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-3 rounded-r-lg hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t text-sm">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'Live collaboration active' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 mr-1 text-gray-500" />
          <span>Changes are saved automatically</span>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeTripPlanner;