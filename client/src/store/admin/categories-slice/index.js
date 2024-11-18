import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categoryList: [], // List to hold category data
};

export const addCategory = createAsyncThunk(
  "/categories/addnewcategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/categories/add`,
        categoryData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Category added:", result);
      return result?.data; 
    } catch (error) {
      // console.error("Error adding category:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Server error";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch all categories
export const fetchAllCategories = createAsyncThunk(
  "/categories/fetchAllCategories",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/categories/get`
    );
    return result?.data; // Assuming the API returns an array of categories
  }
);

// Edit an existing category
export const editCategory = createAsyncThunk(
  "/categories/editCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/admin/categories/edit/${id}`,
        categoryData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data; // Assuming the API returns the updated category data
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Server error";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk(
  "/categories/deleteCategory",
  async (id) => {
    const result = await axios.delete(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/admin/categories/delete/${id}`
    );
    return result?.data; // Assuming the API returns the deleted category's ID
  }
);

// Category slice
const AdminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data || []; // Handle the response safely
      })
      .addCase(fetchAllCategories.rejected, (state) => {
        state.isLoading = false;
        state.categoryList = [];
      });
  },
});

export default AdminCategoriesSlice.reducer;
