import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    username: string;
    email: string;
    fullName: string,
    isVerified: boolean;
};

const initialState: UserState = {
    username: '',
    email: '',
    fullName: '',
    isVerified: false
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.fullName = action.payload.fullName;
            state.isVerified = action.payload.isVerified;
        },
        clearUser: (state) => {
            state.username = '';
            state.email = '';
            state.fullName = '';
            state.isVerified = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;