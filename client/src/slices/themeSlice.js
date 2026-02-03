import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light"
  },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    initializeTheme: (state) => {
      // This will be handled in the component with system preference detection
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      state.mode = prefersDark ? "dark" : "light";
    }
  }
});

export default themeSlice.reducer;
export const { setTheme, toggleTheme, initializeTheme } = themeSlice.actions;