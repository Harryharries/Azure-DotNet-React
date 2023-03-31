import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../shared/model/User";
import axios from "axios";
import { API_BASE_URL } from "../../shared/Constants/apiConstants";
import { JsonResponse } from "../../shared/model/JsonResponse";
import { UserCreate } from "../../shared/model/UserCreate";
import { RootState } from "../../redux/store";

// Redux Store for states management
export interface UsersState {
  init: boolean;
  users: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  loading: boolean;
  filter: string | null;
  createUserStatus: "idle" | "pending" | "fulfilled" | "rejected";
  error: string | null;
}
const initialState: UsersState = {
  users: [],
  init: false,
  filter: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 30,
  loading: false,
  createUserStatus: "idle",
  error: null,
}; 
// Thunk that communicate with apis
export const fetchUsersData = createAsyncThunk(
  "user/fetchUsersData",
  async (params: {
    pageNumber: number;
    pageSize: number;
    filter: string | null;
  }) => {
    try {
      let url = `${API_BASE_URL}/User`;
      url =
        url + `?pageNo=${params.pageNumber}&pageSize=${params.pageSize}`;
      if (params.filter) {
        url = url + `&filter=${params.filter}`;
      }
      const response = await axios.get<JsonResponse>(url);
      return response.data;
    } catch (error: any) {
      let errorMsg = "";
      if (error.response?.data?.status) {
        errorMsg = error.response?.data?.status.message;
      } else {
        errorMsg = error.message;
      }
      throw new Error(errorMsg);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload: UserCreate, { dispatch, getState }) => {
    try {
      const url = `${API_BASE_URL}/User`;;
      await axios.post<UserCreate>(url, payload);

      // Get the current state to fetch the data with the latest parameters
      const state = getState() as RootState;
      const { pageNumber, pageSize, filter } = state.users;

      // Dispatch fetchUserData to refresh the data after creating a User
      dispatch(fetchUsersData({ pageNumber, pageSize, filter }));
    } catch (error: any) {
      let errorMsg = "";
      if (error.response?.data?.status) {
        errorMsg = error.response?.data?.status.message;
      } else {
        errorMsg = error.message;
      }
      throw new Error(errorMsg);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.init = false;
      state.users = [];
      state.pageNumber = 1;
      state.pageSize = 30;
      state.filter = null;
      state.loading = false;
      state.error = null;
    },
    setFetchedInitialData: (state) => {
      state.init = true;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
    resetCreateUserStatus: (state) => {
      state.createUserStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsersData.fulfilled,
        (state, action: PayloadAction<JsonResponse>) => {
          state.users = action.payload.value.map((user: User) => {
            return {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              date_created: user.date_created,
            };
          });
          state.totalCount = action.payload.totalCount;
          state.loading = false;
          state.error = null;
        }
      )
      .addCase(fetchUsersData.rejected, (state, action) => {
        state.loading = false;
        state.totalCount = 0;
        state.error =
          action.error.message || "An error occurred while fetching data";
      })
      .addCase(createUser.pending, (state) => {
        state.createUserStatus = "pending";
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.createUserStatus = "fulfilled";
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createUserStatus = "rejected";
        state.error =
          action.error.message || "An error occurred while creating a User";
      });
  },
});

export const {
  setPageSize,
  setPageNumber,
  setFetchedInitialData,
  resetUserState,
  setFilter,
  resetError,
  resetCreateUserStatus
} = usersSlice.actions;

export default usersSlice.reducer;
