import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
  };

  return (
    <>
      <div className="mt-4">
        <Link
          to="/"
          className="text-[#ffb30f] font-semibold hover:underline ml-40"
        >
          Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap relative mt-8 ml-40">
      <div className="flex flex-col lg:flex-row w-full lg:w-4/5">
        <div className="w-full lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
          <HeartIcon product={product} />
        </div>

        <div className="flex flex-col justify-between w-full lg:w-1/2 lg:ml-8 mt-8 lg:mt-0">
          <h2 className="text-4xl font-bold text-[#ffb30f]">{product.name}</h2>
          <p className="my-4 text-[#ffb30f]">{product.description}</p>
          <p className="text-5xl font-extrabold text-[#ffb30f]">₱ {product.price}</p>

          <div className="flex flex-col mt-4 space-y-4">
            <div className="flex items-center text-[#e4a91d]">
              <FaStore className="mr-2" /> <span>Brand: {product.brand}</span>
            </div>
            <div className="flex items-center text-[#e4a91d]">
              <FaClock className="mr-2" /> <span>Added: {moment(product.createAt).fromNow()}</span>
            </div>
            <div className="flex items-center text-[#e4a91d]">
              <FaStar className="mr-2" /> <span>Reviews: {product.numReviews}</span>
            </div>
            <div className="flex items-center text-[#e4a91d]">
              <FaShoppingCart className="mr-2" /> <span>Quantity: {product.quantity}</span>
            </div>
            <div className="flex items-center text-[#e4a91d]">
              <FaBox className="mr-2" /> <span>In Stock: {product.countInStock}</span>
            </div>
          </div>

          <div className="flex flex-col mt-8 space-y-4">
            <Ratings value={product.rating} text={`${product.numReviews} reviews`} color="amber-500" />
            {product.countInStock > 0 && (
              <select
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="p-2 rounded-lg border border-white-300 text-black"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-[#ffb30f] hover:bg-[#b7791f] text-black py-2 px-4 rounded-lg transition duration-200"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>


            <div className="mt-20 w-full">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={product}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
