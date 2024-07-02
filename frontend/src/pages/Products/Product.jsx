import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
      <div className="bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-60 object-cover"
          />
          <HeartIcon product={product} />
        </div>
        <div className="p-4">
          <Link to={`/product/${product._id}`}>
            <h2 className="text-lg font-semibold text-dark-midnight-blue mb-2">
              {product.name}
            </h2>
            <p className="text-amber-500 font-bold">₱ {product.price}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
