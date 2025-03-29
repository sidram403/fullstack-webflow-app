import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import useAuthStore from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await loginUser(email, password);
  
    if (response.success) {
      const { user, token } = response;
      useAuthStore.getState().login(user, token);  // Ensure token is passed
      navigate("/dashboard");
    } else {
      setError(response.message);
    }
  };
  

  return (
    <div
      className="flex h-screen w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTExL3Jhd3BpeGVsX29mZmljZV8zMF9hYnN0cmFjdF9ncmFkaWVudF93aGl0ZV9iYWNrZ3JvdW5kX3ZlY3Rvcl9wcl9kZGY3ZTJiNC0wMjU3LTRjMTUtOWFjNS0xMmQwZTA0N2E4MWYuanBn.jpg')",
      }}
    >
      {/* Left Section */}
      <div className="w-1/2  flex flex-col justify-center items-center px-12">
        <img
          src="/logo_highbridge.png"
          alt="HighBridge Logo"
          className="mb-6"
        />
        <h1 className="text-white text-3xl font-bold mb-4">
          Building the Future...
        </h1>
        <p className="text-white text-lg text-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 shadow-lg rounded-lg w-96"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Log In to your Account
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-4"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between items-center mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember me
            </label>
            <a href="#" className="text-sm text-blue-600">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white p-3 rounded-lg font-bold"
          >
            Log In
          </button>

          <div className="text-center my-4">Or</div>

          <button className="w-full border p-3 rounded-lg flex items-center justify-center mb-2">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/022/484/503/small/google-lens-icon-logo-symbol-free-png.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />{" "}
            Log In with Google
          </button>
          <button className="w-full border p-3 rounded-lg flex items-center justify-center mb-2">
            <img
              src="https://static.vecteezy.com/system/resources/previews/042/127/218/non_2x/round-circle-blue-facebook-logo-with-long-shadow-on-a-transparent-background-free-png.png"
              alt="Facebook"
              className="w-5 h-5 mr-2"
            />{" "}
            Log In with Facebook
          </button>
          <button className="w-full border p-3 rounded-lg flex items-center justify-center">
            <img
              src="https://cdn.freebiesupply.com/images/large/2x/apple-logo-transparent.png"
              alt="Apple"
              className="w-5 h-5 mr-2"
            />{" "}
            Log In with Apple
          </button>

          <p className="text-center mt-4 text-sm">
            New User?{" "}
            <Link to={"/register"}>
              <span className="font-bold text-black">
                REGISTER HERE
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
