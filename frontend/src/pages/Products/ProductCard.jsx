import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

import "./css_style/productcard.css"; // Importing shop.css

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="product-container">
      <div style={{ position: 'relative' }}>
        <Link to={`/product/${p._id}`}>
          <img
            className="product-image"
            src={p.image}
            alt={p.name}
          />
          <div className="brand-overlay">
            <span className="product-brand">{p?.brand}</span>
          </div>
        </Link>
        <HeartIcon product={p} />
      </div>

      <div className="product-details">
        <div>
          <h5 className="product-name">{p?.name?.substring(0, 20)}...</h5>
          <p className="product-price">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "PHP",
            })}
          </p>
        </div>

        <p className="product-description">
          {p?.description?.substring(0, 60)} ...
        </p>

        <div className="product-actions">
          <Link to={`/product/${p._id}`} className="read-more-button">
            Read More
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 14 10"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "20px", height: "20px", strokeWidth: "2" }} // Adjusted width, height, and strokeWidth
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M1 5h12M9 1l4 4-4 4"
              />
            </svg>
          </Link>

          <button
            className="cart-button"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
