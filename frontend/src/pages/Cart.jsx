import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container mx-auto mt-8 px-4"> {/* Added padding on the sides */}
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-700">
            Your cart is empty! <br />
            <Link to="/shop" className="text-blue-500 hover:underline">
              Go back to shop...
            </Link>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full md:w-[80%]">
              <h1 className="text-3xl font-semibold mb-8 text-center">Shopping Cart</h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center mb-6 bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="w-1/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 px-4 py-2">
                    <Link to={`/product/${item._id}`} className="text-amber-500 hover:underline">
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                    </Link>
                    <p className="text-black">{item.brand}</p>
                    <p className="text-gray-800 font-bold mt-2">₱ {item.price}</p>
                    <div className="flex items-center mt-4">
                    <div className="w-24 mr-4">
                      <select
                        className="w-full py-2 px-2 border border-gray-300 rounded text-gray-800"
                        value={item.qty}
                        onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="text-red-500"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                  </div>

                  
                </div>
              ))}

              <div className="mt-10">
                <div className="bg-black rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">Total Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</h2>
                  <div className="text-2xl font-bold text-white">
                    ₱{" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>

                  <button
                    className="bg-amber-500 text-black mt-6 py-3 px-6 rounded-full text-lg w-full hover:bg-green-600"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
