import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "@/config"; 

const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async(credentials, {rejectWithValue}) => {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
                personal_info: credentials
            });
            return response.data;
        } catch(error){
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
)

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async(credentials, {rejectWithValue}) => {
        try{
            const response = await axios.post(`${BACKEND_URL}/api/auth/signup`, {
                personal_info: credentials
            }
            );
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response?.data?.message || "Signup failed");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.loading = false;
            state.error = null;

            localStorage.setItem('userToken', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;
            state.loading = false;
            state.error = null;

            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
        },
        loadUserFromLocalStorage: (state) => {
            const storedToken = localStorage.getItem('userToken');
            const storedUser = localStorage.getItem('user');

            if(storedToken && storedUser){
                state.token = storedToken;
                state.user = JSON.parse(storedUser);
                state.isLoggedIn = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.loading = false;
            state.error = null;
            localStorage.setItem('userToken', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Login failed";
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
        })
        .addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(signupUser.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.loading = false;
            state.error = null;
                localStorage.setItem('userToken', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
        })
        .addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Login failed";
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
        })
    }
})

export const {setCredentials, logout, loadUserFromLocalStorage} = authSlice.actions;
export default authSlice.reducer;