import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage (if available)
const storedUser = JSON.parse(localStorage.getItem("user")) || null;

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: storedUser, // Load user from localStorage
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;

            // Save user to localStorage
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user"); // Remove user from storage on logout
            }
        },
    },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
