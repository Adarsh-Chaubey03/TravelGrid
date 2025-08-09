import { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import TravelCard from '../components/TravelCard';

const ITEMS_PER_PAGE = 6;

const Wishlist = () => {
  const { wishlist } = useWishlist();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const paginated = wishlist.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-black via-gray-900 to-pink-900 pt-20">
      <h2 className="text-2xl font-bold mb-4 text-white">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-300">No packages in your wishlist.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginated.map(pkg => (
              <TravelCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="px-4 py-2 rounded bg-pink-700 text-white disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-white">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-4 py-2 rounded bg-pink-700 text-white disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
