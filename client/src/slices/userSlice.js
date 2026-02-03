import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      userId: null,
      name: null,
      email: null,
      avatar: null,
    },
    isLoggedIn: false,
  },
  reducers: {
    setUser: (state, action) => {
      const userId = action.payload.userId || action.payload._id;
      const userIdString = typeof userId === 'string' ? userId : String(userId);

      state.userInfo = {
        userId: userIdString,
        name: action.payload.name,
        email: action.payload.email,
        avatar: action.payload.avatar,
      };
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.userInfo = {
        userId: null,
        name: null,
        email: null,
        avatar: null,
      };
      state.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;