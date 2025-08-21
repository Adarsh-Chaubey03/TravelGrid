import { useState, useEffect } from 'react';

export default function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePRs, setVisiblePRs] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/repos/Adarsh-Chaubey03/TravelGrid/contributors'
        );
        if (!res.ok) throw new Error('Failed to fetch contributors');
        const data = await res.json();

        const enriched = await Promise.all(
          data.map(async (contributor) => {
            try {
              const prRes = await fetch(
                `https://api.github.com/search/issues?q=type:pr+repo:Adarsh-Chaubey03/TravelGrid+author:${contributor.login}`
              );
              const prData = await prRes.json();

              const allPRs = (prData.items || []).slice(0, 3);

              const mergedPRs = await Promise.all(
                allPRs.map(async (pr) => {
                  const prNumber = pr.number;
                  const prDetailsRes = await fetch(
                    `https://api.github.com/repos/Adarsh-Chaubey03/TravelGrid/pulls/${prNumber}`
                  );
                  if (!prDetailsRes.ok) return null;
                  const prDetails = await prDetailsRes.json();
                  return prDetails.merged ? pr : null;
                })
              );

              return {
                ...contributor,
                pullRequests: mergedPRs.filter(Boolean),
              };
            } catch {
              return { ...contributor, pullRequests: [] };
            }
          })
        );

        setContributors(enriched);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  const togglePRs = (login) => {
    setVisiblePRs((prev) => ({ ...prev, [login]: !prev[login] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <p className="text-pink-200 text-xl">Loading contributors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-400 mb-8 text-center">Our Contributors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <a href={contributor.html_url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={contributor.avatar_url}
                    alt={contributor.login}
                    loading="lazy" 
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-pink-400"
                  />
                  <div className="text-xl font-semibold text-pink-300">{contributor.login}</div>
                  <div className="text-pink-200 text-sm">@{contributor.login}</div>
                  <div className="text-pink-100 text-sm mt-1">
                    {contributor.contributions} commit
                    {contributor.contributions !== 1 ? 's' : ''}
                  </div>
                </a>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => togglePRs(contributor.login)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded-md text-sm"
                >
                  {visiblePRs[contributor.login] ? 'Hide Merged PRs' : 'Show Merged PRs'}
                </button>
              </div>

              {visiblePRs[contributor.login] && (
                <div className="mt-4 text-pink-100 text-sm">
                  {contributor.pullRequests.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {contributor.pullRequests.map((pr) => (
                        <li key={pr.id}>
                          <a
                            href={pr.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-200 hover:underline"
                          >
                            {pr.title.length > 50
                              ? pr.title.slice(0, 50) + '...'
                              : pr.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic">No merged PRs</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
