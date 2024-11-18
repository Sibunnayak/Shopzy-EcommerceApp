import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  brandList: [], 
};

export const addBrand = createAsyncThunk(
  "/brands/addnewbrand",
  async (brandData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/brands/add`,
        brandData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Brand added:", result);
      return result?.data; 
    } catch (error) {
      // console.error("Error adding brand:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Server error";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch all brands
export const fetchAllBrands = createAsyncThunk(
  "/brands/fetchAllBrands",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/brands/get`
    );
    return result?.data; // Assuming the API returns an array of brands
  }
);

// Edit an existing brand
export const editBrand = createAsyncThunk(
  "/brands/editBrand",
  async ({ id, brandData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/admin/brands/edit/${id}`,
        brandData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data; // Assuming the API returns the updated brand data
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Server error";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete a brand
export const deleteBrand = createAsyncThunk(
  "/brands/deleteBrand",
  async (id) => {
    const result = await axios.delete(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/admin/brands/delete/${id}`
    );
    return result?.data; // Assuming the API returns the deleted brand's ID
  }
);

// Brand slice
const AdminBrandsSlice = createSlice({
  name: "adminBrands",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch brands
      .addCase(fetchAllBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brandList = action.payload.data || []; // Handle the response safely
      })
      .addCase(fetchAllBrands.rejected, (state) => {
        state.isLoading = false;
        state.brandList = [];
      });
  },
});

export default AdminBrandsSlice.reducer;
