import {createSlice} from '@reduxjs/toolkit';
const themeSlice = createSlice(
  {
    name: "theme",
    initialState: {
      mode: "light"
    },
    reducers: {
      // we will dispatch these actions for the calls
      setTheme: (state,action) => {
        state.mode = action.payload;
      },
    }

  }
)

export default themeSlice.reducer;
export const {setTheme} = themeSlice.actions;