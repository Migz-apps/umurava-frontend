import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: "admin" | "manager" | "recruiter";
  avatarUrl?: string;
  company?: string;
  jobTitle?: string;
  profileCompletion: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ user: AuthUser; token: string }>("/auth/login", credentials);
      if (response.success && response.data) {
        apiClient.setToken(response.data.token);
        return response.data;
      }
      return rejectWithValue(response.error || "Login failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "admin" | "manager" | "recruiter";
    company?: string;
    jobTitle?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ user: AuthUser; token: string }>("/auth/register", data);
      if (response.success && response.data) {
        apiClient.setToken(response.data.token);
        return response.data;
      }
      return rejectWithValue(response.error || "Registration failed");
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.post("/auth/logout");
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<AuthUser>("/auth/me");
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to fetch user");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      apiClient.setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    updateProfile: (state: AuthState, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state: AuthState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Login
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state: AuthState, action: PayloadAction<{ user: AuthUser; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state: AuthState, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state: AuthState, action: PayloadAction<{ user: AuthUser; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state: AuthState, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout user (backend call)
      .addCase(logoutUser.fulfilled, (state: AuthState) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        apiClient.setToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      })
      // Fetch current user
      .addCase(fetchCurrentUser.pending, (state: AuthState) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state: AuthState, action: PayloadAction<AuthUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state: AuthState) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, updateProfile, clearError } = authSlice.actions;
export default authSlice.reducer;
