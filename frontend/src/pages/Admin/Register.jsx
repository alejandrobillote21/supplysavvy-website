// Register.jsx

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Register = () => {
  const [id_number, setIdNumber] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+{}:"<>?[\];',./`~\-])[A-Za-z\d!@#$%^&*()_+{}:"<>?[\];',./`~\-]{6,8}$/;
    return passwordRegex.test(password);
  };

  const handleMobileChange = (e) => {
    let inputMobile = e.target.value.replace(/\D/g, '').slice(0, 11); // Remove non-numeric characters and limit to 11 digits
    setMobile(inputMobile);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else if (!validatePassword(password)) {
      toast.error("Password does not meet criteria: 6-8 characters, at least one uppercase letter, lowercase letters, and a special character.");
    } else {
      try {
        const res = await register({ id_number, firstname, lastname, email, mobile, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900">
      <section className="flex flex-wrap max-w-4xl w-full p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="w-full lg:w-1/ mb-8 lg:mb-0">
          <h1 className="text-4xl font-semibold text-white mb-8">Register</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="id_number" className="block text-sm font-medium text-gray-300">
                ID Number
              </label>
              <input
                type="text"
                id="id_number"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Enter ID Number"
                value={id_number}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-300">
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Enter First Name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Enter Last Name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-300">
                Mobile Number
              </label>
              <input
                type="text"
                id="mobile"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Enter Mobile Number"
                value={mobile}
                onChange={handleMobileChange} // Update onChange handler
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 py-2  text-black-400 hover:text-black"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <p className="text-gray-400 text-sm mt-2">
                Password must be 6-8 characters long, contain at least one uppercase letter, one lowercase letter, and one special character.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-3 px-4 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition duration-300"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-6 text-gray-400">
            <p>
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-amber-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
