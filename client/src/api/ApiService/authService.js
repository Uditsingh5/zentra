import API from "../axios.js";

export const SignupUser = async (data) => {
  try {
    const res = await API.post("/auth/signup", data);
    return res.data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const res = await API.get("/user/me");
    return res.data;
  } catch (error) {
    console.error("Get user error:", error);
    throw error;
  }
};
