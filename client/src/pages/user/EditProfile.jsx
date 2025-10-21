import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProfileEditForm from "@/components/user/ProfileEditForm";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse w-80 h-48 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-lg" />
    </div>
  );

  const handleSave = (form) => {
    setLoading(true);
    // Simulate API call, replace with real updateUser
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully!");
      navigate("/user/profile");
    }, 1200);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-pink-50 to-fuchsia-100 dark:from-slate-900 dark:to-slate-800 py-8 px-2">
      <ProfileEditForm
        user={user}
        onSave={handleSave}
        onCancel={() => navigate("/user/profile")}
        loading={loading}
      />
    </div>
  );
}
