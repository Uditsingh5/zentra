import {configureStore} from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice.js';
import userReducer from './slices/userSlice.js';
import settingsReducer from "./slices/settingsSlice.js"
const store = configureStore(
  {
    reducer:{
      theme: themeReducer,
      user: userReducer,
      settings: settingsReducer,
    }
  }
)
export default store;