import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import "./css_style/profile.css"; // Make sure this imports your custom CSS properly

const Profile = () => {
  const [id_number, setIdNumber] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to manage show/hide password
  const [mobileError, setMobileError] = useState(""); // State to manage mobile number error

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  useEffect(() => {
    setIdNumber(userInfo.id_number);
    setFirstName(userInfo.firstname);
    setLastName(userInfo.lastname);
    setEmail(userInfo.email);
    setMobile(userInfo.mobile);
  }, [userInfo.email, userInfo.firstname, userInfo.lastname, userInfo.id_number, userInfo.mobile]);

  const dispatch = useDispatch();

  // Function to format mobile number to numeric format (remove non-digits)
  const formatMobileNumber = (value) => {
    return value.replace(/\D/g, "");
  };

  // Function to validate mobile number
  const validateMobileNumber = (value) => {
    if (!value || typeof value !== "string") {
      setMobileError("Invalid mobile number");
      return false;
    }

    const phoneNumber = value.replace(/\D/g, "");
    if (!phoneNumber.match(/^[0-9]{11}$/)) {
      setMobileError("Mobile number must be 11 digits long");
      return false;
    } else {
      setMobileError("");
      return true;
    }
  };

  const handleMobileChange = (e) => {
    const formattedMobile = formatMobileNumber(e.target.value);
    setMobile(formattedMobile);
    // Validate the mobile number on change
    validateMobileNumber(formattedMobile);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Check if mobile number is valid
    if (!validateMobileNumber(mobile)) {
      return; // Exit submitHandler if mobile number is invalid
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          id_number,
          firstname,
          lastname,
          email,
          mobile: parseInt(mobile), // Ensure mobile is sent as a number
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container profile-container">
      <div className="md:w-2/3 lg:w-4/5 xl:w-3/4 mx-auto">
        <h2 className="section-header mb-6 text-3xl md:text-4xl lg:text-5xl text-center">Update Profile</h2>
        <form onSubmit={submitHandler} className="bg-gray-700 p-8 rounded-lg">
          <div className="mb-4">
            <label className="block text-white mb-2">ID Number</label>
            <p className="form-input p-4 rounded-sm w-full bg-gray-500 cursor-not-allowed">{id_number}</p>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter First Name"
              className="form-input p-4 rounded-sm w-full"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter Last Name"
              className="form-input p-4 rounded-sm w-full"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              className="form-input p-4 rounded-sm w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Mobile Number</label>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              className={`form-input p-4 rounded-sm w-full ${mobileError ? 'border-red-500' : ''}`}
              value={mobile}
              onChange={handleMobileChange}
            />
            {mobileError && <p className="text-red-500 mt-1">{mobileError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="form-input p-4 rounded-sm w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 mr-4 px-3 py-2 flex items-center"
                onClick={toggleShowPassword}
                style={{ top: "50%", transform: "translateY(-80%)" }}
              >
                {showPassword ? (
                  <IoIosEyeOff className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                ) : (
                  <IoIosEye className="text-gray-500 hover:text-gray-700 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-white mb-2">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="form-input p-4 rounded-sm w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between pr-4"> {/* Adjusted to justify-between and added pr-4 for right padding */}
            <button
              type="submit"
              className="bg-amber-600 text-black py-2 px-4 rounded hover:bg-amber-700 mr-5"
            >
              Update
            </button>

            <Link
              to="/user-orders"
              className="bg-amber-600 text-black py-2 px-4 rounded hover:bg-amber-700 mr-5"
            >
              My Orders
            </Link>
          </div>

          {loadingUpdateProfile && <Loader />}
        </form>
      </div>
    </div>
  );
};

export default Profile;
