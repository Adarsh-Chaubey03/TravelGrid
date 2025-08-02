import { useWishlist } from '../context/WishlistContext';
import TravelCard from '../components/TravelCard';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No packages in your wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map(pkg => (
            <TravelCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
