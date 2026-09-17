import { createSlice } from "@reduxjs/toolkit";

const KEY = "meditrust-auth";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { user: null, token: null, profile: null };
    return { user: null, token: null, profile: null, ...JSON.parse(raw) };
  } catch {
    return { user: null, token: null, profile: null };
  }
}

function persist(state) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ token: state.token, user: state.user, profile: state.profile })
    );
  } catch {
    // storage full / unavailable
  }
}

const initialState = load();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = {
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone,
      };
      state.profile = action.payload.profile || null;
      persist(state);
    },
    setProfile(state, action) {
      state.profile = action.payload;
      if (action.payload) {
        state.user = {
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
        };
      }
      persist(state);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.profile = null;
      localStorage.removeItem(KEY);
    },
  },
});

export const { setCredentials, setProfile, logout } = authSlice.actions;
export default authSlice.reducer;
