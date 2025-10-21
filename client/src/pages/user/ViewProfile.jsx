import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProfileCard from "@/components/user/ProfileCard";

export default function ViewProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse w-80 h-48 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-lg" />
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-pink-50 to-fuchsia-100 dark:from-slate-900 dark:to-slate-800 py-8 px-2">
      <ProfileCard user={user} onEdit={() => navigate('/user/profile/edit')} />
    </div>
  );
}
