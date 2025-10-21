import React from "react";

export default function ProfileCard({ user, onEdit }) {
  return (
    <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col items-center">
      {onEdit && (
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-pink-100 hover:bg-pink-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
          onClick={onEdit}
          aria-label="Edit Profile"
        >
          <span className="sr-only">Edit</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z"></path></svg>
        </button>
      )}
      {user?.picture ? (
        <img src={user.picture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-pink-400 shadow-md mb-4" />
      ) : (
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-pink-600 text-white text-4xl font-bold mb-4">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="text-2xl font-bold mb-1 text-center">{user?.name}</div>
      <div className="text-gray-500 dark:text-gray-300 text-center mb-2">{user?.email}</div>
      <div className="flex flex-col gap-2 w-full mt-4">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-400">Joined:</span>
          <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-600 dark:text-gray-400">Total Trips:</span>
          <span>{user?.totalTrips ?? 0}</span>
        </div>
      </div>
    </div>
  );
}
