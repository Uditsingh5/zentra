import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch settings for a user
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/user/settings/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Fetch settings error:", err);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Update settings for a user
export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async ({ userId, updatedSettings }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/user/settings/${userId}`, updatedSettings);
      return res.data;
    } catch (err) {
      console.error("Update settings error:", err);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
  dirty: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    localUpdate: (state, action) => {
      const { section, key, value } = action.payload;
      if (!state.data) state.data = {};
      state.data[section] = { ...state.data[section], [key]: value };
      state.dirty = true;
    },
    resetDirty: (state) => {
      state.dirty = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.dirty = false;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { localUpdate, resetDirty } = settingsSlice.actions;
export default settingsSlice.reducer;