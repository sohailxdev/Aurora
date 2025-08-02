import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { BASE_URL } from "../../lib/constant";
import { toast } from "sonner";
import axios from "axios";

export interface Address {
  pincode: string;
  local_address: string;
  state: string;
  city: string;
  district: string;
  country: string;
  landmark: string;
  addressName: string;
  addressname: string;
  id: string;
}

export interface User {
  id: string;
  username: string;
  authority_id: number;
  authority: string;
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  addresses: Address[];
}

interface UserState {
  user: User;
  isAuthenticated: boolean;
  error: any;
  loading: boolean;
  profileLoading: boolean;
}

const initialState: UserState = {
  user: {} as User,
  isAuthenticated: false,
  error: null,
  loading: false,
  profileLoading: false,
};

export const userLogin = createAsyncThunk(
  "user/login",
  async (data: any, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/login`, data);
      const result = response.data;

      if (response.status === 200) {
        toast.success("Login successful", {
          duration: 800,
          position: "top-center",
        });
        localStorage.setItem("token", `${"Bearer " + result?.token}`);
        return result;
      } else {
        toast.error(result?.message);
        return thunkAPI.rejectWithValue(result);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "user/getDetails",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/getUserDetails`);
      const result = await response.data;

      if (response.status === 200) {
        return result;
      } else {
        toast.error(result?.message || "Failed to fetch user details");
        return thunkAPI.rejectWithValue(result);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {} as User;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    setIsAutenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(userLogin.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(getUserDetails.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
        };
        state.profileLoading = false;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const { logout, setIsAutenticated } = userSlice.actions;
export const selectLoading = (state: RootState) => state.user.loading;
export const selectUser = (state: RootState) => state.user;
