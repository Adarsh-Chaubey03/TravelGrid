import React, { useState, useRef } from "react";

export default function ProfileEditForm({ user, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    picture: user?.picture || "",
    password: "",
    confirmPassword: ""
  });
  const [preview, setPreview] = useState(user?.picture || "");
  const fileInput = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, picture: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleRemovePic = () => {
    setForm((f) => ({ ...f, picture: "" }));
    setPreview("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
      <div className="relative">
        {preview ? (
          <img src={preview} alt="Profile preview" className="w-24 h-24 rounded-full object-cover border-4 border-pink-400 shadow-md" />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-pink-600 text-white text-4xl font-bold">
            {form.name?.charAt(0).toUpperCase()}
          </div>
        )}
        {preview && (
          <button type="button" onClick={handleRemovePic} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600">Remove</button>
        )}
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-gray-700 dark:text-gray-200">Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input input-bordered w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
          required
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-gray-700 dark:text-gray-200">Email</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="input input-bordered w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-gray-700 dark:text-gray-200">Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={handleFile}
          className="file-input file-input-bordered w-full rounded-md bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-gray-700 dark:text-gray-200">Password <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span></label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="input input-bordered w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
          autoComplete="new-password"
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-gray-700 dark:text-gray-200">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          className="input input-bordered w-full rounded-md px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
          autoComplete="new-password"
        />
      </div>
      <div className="flex gap-3 w-full mt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-md transition-all shadow-md disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold py-2 rounded-md transition-all shadow-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
