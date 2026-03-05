import { createSlice } from "@reduxjs/toolkit";

interface SessionState {
  expired: boolean;
}

const initialState: SessionState = {
  expired: false,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionExpired: (state) => {
      state.expired = true;
    },
    resetSession: (state) => {
      state.expired = false;
    },
  },
});

export const { sessionExpired, resetSession } = sessionSlice.actions;
export default sessionSlice.reducer;
