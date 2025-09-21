import { useWishlist } from '../context/WishlistContext';
import { Heart, Trash2 } from 'lucide-react';

const TravelCard = ({ pkg }) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isInWishlist = wishlist.find(item => item.id === pkg.id);

  return (
    <div className="rounded-xl shadow-md p-4 bg-white relative transition hover:shadow-xl">
      <img
        src={pkg.image}
        alt={pkg.name}
        className="rounded-md w-full h-48 object-cover"
        loading="lazy"
      />
      <h2 className="text-lg font-semibold mt-2">{pkg.name}</h2>
      <p className="text-sm text-gray-600">{pkg.description}</p>

      {/* ❤️ Wishlist Toggle Button */}
      <button
  className="absolute top-3 right-3"
  aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
  title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
  onClick={() =>
    isInWishlist ? removeFromWishlist(pkg.id) : addToWishlist(pkg)
  }
>
  {isInWishlist ? <Trash2 color="red" /> : <Heart />}
</button>

      
    </div>
  );
};

export default TravelCard;
