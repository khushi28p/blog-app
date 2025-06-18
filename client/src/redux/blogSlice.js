import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title: "",
    jsonContent: [],
    htmlContent: '',
    bannerImageUrl: "",
    description: "",
    tags: []
}

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers:{
        setBlogForPublish: (state, action) => {
      state.title = action.payload.title;
      state.bannerImageUrl = action.payload.bannerImageUrl;
      state.jsonContent = action.payload.jsonContent;
      state.htmlContent = action.payload.htmlContent;
      state.description = action.payload.description;
      state.tags = [];
    },
    updatePublishTags: (state, action) => {
      state.tags = action.payload;
    },
    updatePublishDescription: (state, action) => {
      state.description = action.payload;
    },
    clearPublishData: (state) => {
      Object.assign(state, initialState); 
    },
    }
})

export const {
  setBlogForPublish,
  updatePublishTags,
  updatePublishDescription,
  clearPublishData,
} = blogSlice.actions;

export default blogSlice.reducer;