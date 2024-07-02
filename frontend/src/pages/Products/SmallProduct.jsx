import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-64 ml-8 rounded-lg shadow-md overflow-hidden">
      <div className="bg-black p-4">
        <div className="relative aspect-w-1 aspect-h-1">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover rounded-lg"
          />
          <HeartIcon product={product} />
        </div>

        <div className="mt-3">
          <Link to={`/product/${product._id}`} className="block">
            <h2 className="text-lg font-semibold text-white mb-2">{product.name}</h2>
            <div className="flex items-center">
              <span className="bg-amber-500 text-black text-sm font-medium px-3 py-1 rounded-full">
                ₱ {product.price}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
