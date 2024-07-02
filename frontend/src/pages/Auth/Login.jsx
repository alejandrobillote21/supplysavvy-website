import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import SupplySavvyLogo from "../../images/logo/SupplySavvy-logo.png"; // Corrected import statement

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-900">
      <section className="flex flex-wrap max-w-4xl w-full p-8 bg-gray-800 rounded-lg shadow-lg">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-4xl font-semibold text-white mb-8">Sign In</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-3 w-full rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-3 px-4 bg-amber-500 text-black font-semibold rounded-md hover:bg-amber-600 transition duration-300"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-6 text-gray-400">
            <p>
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-amber-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <img
            src={SupplySavvyLogo} // Use the imported image
            alt="Logo"
            className="h-auto max-h-96 rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Login;
