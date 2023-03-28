import { createSlice, current } from '@reduxjs/toolkit'


const initialState =
{
    currentPost: null,
    loading: false,
    error: false
}

export const PostsSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
      fetchStart: (state) =>
      {
        state.loading = true
      },
      fetchSuccess: (state, action) =>
      {
        state.currentPost = action.payload
      },
      remove: (state) =>
      {
        state.currentPost = null
      },
      fetchFailure: (state) =>
      {
        state.loading = false
        state.error = true
      },
      favourite: (state) =>
      {
        state.currentPost.favouritesCount++;
      },
      unfavourite: (state) =>
      {
        state.currentPost.favouritesCount--;
      }
    }
  })

  export const { fetchStart, fetchSuccess, fetchFailure, favourite, unfavourite, remove } = PostsSlice.actions

  export default PostsSlice.reducer