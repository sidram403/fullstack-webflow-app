import API from "./apiClient";

export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });

    // Store user data and token securely
    if (response.data?.user && response.data?.token) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
    }

    return { success: true, user: response.data.user, token: response.data.token };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

export const registerUser = async (email, password, username) => {
  try {
    const response = await API.post("/auth/register", { email, password , username});

    // Store user data and token securely
    if (response.data?.user && response.data?.token) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
    }

    return { success: true, user: response.data.user, token: response.data.token };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    };
  }
};
