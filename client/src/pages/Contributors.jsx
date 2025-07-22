import React, { useEffect, useState } from 'react';

export default function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://api.github.com/repos/Adarsh-Chaubey03/TravelGrid/contributors')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contributors');
        return res.json();
      })
      .then((data) => {
        setContributors(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 flex flex-col items-center py-12">
      {/* Home Icon */}
      <a
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-pink-100 dark:hover:bg-gray-700 transition-colors border border-pink-300 dark:border-gray-600"
        title="Back to Home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="#ec4899"
          className="w-7 h-7"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V21h15V10.5" />
        </svg>
      </a>
      <h1 className="text-4xl font-bold text-pink-400 dark:text-pink-400 mb-8">Our Contributors</h1>
      {loading ? (
        <div className="text-pinkល0text-pink-200 dark:text-gray-200 text-xl">Loading...</div>
      ) : error ? (
        <div className="text-pink-200 dark:text-gray-200 text-xl">Unable to load contributors. Please try again later.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
          {contributors.map((contributor) => (
            <a
              key={contributor.id}
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform border-2 border-pink-400 dark:border-gray-600"
            >
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className="w-24 h-24 rounded-full border-4 border-pink-400 dark:border-pink-400 mb-4 shadow-md"
              />
              <div className="text-xl font-semibold text-pink-300 dark:text-pink-300">@{contributor.login}</div>
              <div className="text-white dark:text-gray-200 text-sm mb-2">{contributor.login}</div>
              <div className="text-gray-800 dark:text-gray-200 text-xs bg-pink-500 dark:bg-pink-600 rounded-full px-3 py-1 mt-2 shadow">
                {contributor.contributions} commit{contributor.contributions !== 1 ? 's' : ''}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}