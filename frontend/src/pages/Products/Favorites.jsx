import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-3xl font-bold mt-12 text-dark-cerulean text-center">
          FAVORITE PRODUCTS
        </h1>

        <div className="flex justify-center mt-6">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
