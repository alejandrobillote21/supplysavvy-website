import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import "./css_style/placeorder.css"

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, contactNumber, paymentMethod, shippingOption, itemsPrice, shippingPrice, totalPrice } = cart;

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress?.address || !contactNumber) {
      navigate("/shipping");
    }
  }, [shippingAddress, contactNumber, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        contactNumber,
        paymentMethod,
        shippingOption,
        itemsPrice,
        shippingPrice,
        totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error.message || "Failed to place order");
      console.error("Order Placement Error:", error);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />

      <div className="container mx-auto mt-8">
        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="text-left">
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>
                    <td className="p-2">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{item.price.toFixed(2)}</td>
                    <td className="p-2">₱ {(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
          <div className="flex flex-wrap justify-between bg-gray-900 rounded-lg text-white p-8">
            <div className="w-full md:w-1/2 mb-6">
              <h3 className="text-lg font-semibold mb-2">Order Details</h3>
              <ul>
                <li><span className="font-semibold">Items:</span> ₱{itemsPrice}</li>
                <li><span className="font-semibold">Shipping:</span> ₱{shippingPrice}</li>
                <li><span className="font-semibold">Total:</span> ₱{totalPrice}</li>
              </ul>
            </div>

            <div className="w-full md:w-1/2 mb-6">
              <div className="flex justify-end">
                <div className="w-full md:w-2/3 mb-6 ml-auto">
                  <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
                  <div className="ml-auto">
                    <p>
                      <strong>Address:</strong> {shippingAddress?.address}, {shippingAddress?.city} {shippingAddress?.zipCode}, {shippingAddress?.country}
                    </p>
                    <p>
                      <strong>Contact Number:</strong> {contactNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 mb-6">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <p>{paymentMethod}</p>
            </div>

            <div className="w-full md:w-1/2 mb-6">
              <div className="flex justify-end">
                <div className="w-full md:w-2/3 mb-6 ml-auto">
                  <h3 className="text-lg font-semibold mb-2">Shipping Option</h3>
                  <div className="ml-auto">
                    <p>{shippingOption}</p>
                  </div>
                </div>
              </div>
            </div>

            {error && <Message variant="danger">{error.data?.message}</Message>}
          </div>

          <button
            type="button"
            className="bg-yellow-500 text-black py-3 px-6 rounded-full text-lg w-full mt-4"
            disabled={cartItems.length === 0}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>

          {isLoading && <Loader />}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
