import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  saveContactNumber,
  savePaymentMethod,
  saveShippingOption,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const { contactNumber } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal" || "Counter" || "COD" || "Tuition");
  const [shippingOption, setShippingOption] = useState("DOOR TO DOOR DELIVERY"  || "SELF PICK UP");
  const [contactNumberValue, setContactNumberValue] = useState(contactNumber || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [zipCode, setZipCode] = useState(shippingAddress.zipCode || "");
  const [country, setCountry] = useState(shippingAddress.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateContactNumber = (number) => {
    // Remove any non-numeric characters
    const cleaned = number.replace(/\D/g, "");
    // Ensure it is 11 digits long and starts with "09"
    if (cleaned.length === 11 && cleaned.startsWith("09")) {
      return cleaned;
    }
    return contactNumberValue; // Return current value if validation fails
  };

  const handleContactNumberChange = (e) => {
    const newNumber = e.target.value;
    setContactNumberValue(newNumber);
  };

  const handleBlur = () => {
    setContactNumberValue(validateContactNumber(contactNumberValue));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (contactNumberValue.length !== 11 || !contactNumberValue.startsWith("09")) {
      alert("Please enter a valid Philippine mobile number (11 digits, starting with '09').");
      return;
    }

    dispatch(saveShippingAddress({ address, city, zipCode, country }));
    dispatch(saveContactNumber(contactNumberValue));
    dispatch(savePaymentMethod(paymentMethod));
    dispatch(saveShippingOption(shippingOption));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  useEffect(() => {
    if (!contactNumber) {
      navigate("/shipping");
    }
  }, [navigate, contactNumber]);

  return (
    <div className="container mx-auto mt-10">
      <ProgressSteps step1 step2 />
      <div className="mt-[10rem] flex justify-around items-center flex-wrap">
        <form onSubmit={submitHandler} className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">Shipping Details</h1>
          <div className="mb-4">
            <label className="block text-white mb-2">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter address"
              value={address}
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter city"
              value={city}
              required
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Zip Code</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter zip code"
              value={zipCode}
              required
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Country</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter country"
              value={country}
              required
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Contact Number</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter contact number"
              value={contactNumberValue}
              required
              onChange={handleContactNumberChange}
              onBlur={handleBlur}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-400">Select Payment Method</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2">PAYPAL OR CREDIT CARD</span>
                </label>
              </div>

              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500"
                    name="paymentMethod"
                    value="Counter"
                    checked={paymentMethod === "Counter"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2">PAY AT THE COUNTER</span>
                </label>
              </div>

              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2">CASH ON DELIVERY</span>
                </label>
              </div>

              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500"
                    name="paymentMethod"
                    value="Tuition"
                    checked={paymentMethod === "Tuition"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2">ADD TO YOUR NEXT TUITION</span>
                </label>
              </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Shipping Options</label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500"
                    name="shippinOption"
                    value="DOOR TO DOOR DELIVERY"
                    checked={shippingOption === "DOOR TO DOOR DELIVERY"}
                    onChange={(e) => setShippingOption(e.target.value)}
                  />
                  <span className="ml-2">DOOR TO DOOR DELIVERY</span>
                </label>
              </div>

              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500"
                    name="shippinOption"
                    value="SELF PICK UP"
                    checked={shippingOption === "SELF PICK UP"}
                    onChange={(e) => setShippingOption(e.target.value)}
                  />
                  <span className="ml-2">SELF PICK UP</span>
                </label>
              </div>
          </div>

          <button
            className="bg-amber-500 text-black py-2 px-4 rounded-full text-lg w-full"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
