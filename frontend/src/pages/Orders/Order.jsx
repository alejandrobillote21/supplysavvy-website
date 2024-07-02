import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "PHP",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPaPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container mx-auto p-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-gray-300 rounded-lg p-4">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-500">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">₱ {item.price.toFixed(2)}</td>
                      <td className="p-2 text-center">₱ {(item.qty * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
          <p className="mb-2"><strong className="text-amber-500">Order No.: </strong> {order._id}</p>
          <p className="mb-2"><strong className="text-amber-500">ID Number.: </strong> {order.user.id_number}</p>
          <p className="mb-2"><strong className="text-amber-500">Name: </strong> {order.user.firstname} {order.user.lastname}</p>
          <p className="mb-2"><strong className="text-amber-500">Email: </strong> {order.user.email}</p>
          <p className="mb-2"><strong className="text-amber-500">Shipping Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          <p className="mb-2"><strong className="text-amber-500">Payment Method: </strong> {order.paymentMethod}</p>
          <p className="mb-2"><strong className="text-amber-500">Shipping Option: </strong> {order.shippingOption}</p>
          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="danger">Not paid</Message>
          )}
        </div>

        <div className="border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4 mt-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>₱ {order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>₱ {order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>₱ {order.totalPrice}</span>
          </div>

          {!order.isPaid && (
            <div className="mt-4">
              {loadingPay && <Loader />}
              {isPending ? (
                <Loader />
              ) : (
                <PayPalButtons
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              )}
            </div>
          )}

          {loadingDeliver && <Loader />}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <div className="mt-4">
              <button
                type="button"
                className="bg-amber-500 hover:bg-amber-600 text-white w-full py-2 rounded-lg"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
