import { createSlice } from '@reduxjs/toolkit'


const initialState =
{
    currentComments: null,
    loading: false,
    error: false
}

export const CommentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
      fetchStart: (state) =>
      {
        state.loading = true
      },
      fetchSuccess: (state, action) =>
      {
        state.loading = false
        state.currentComments = action.payload
      },
      fetchFailure: (state) =>
      {
        state.loading = false
        state.error = true
      },
      add: (state, action) =>
      {
        state.currentComments.unshift(action.payload)
      },
      remove: (state, action) => {
        state.currentComments.splice(state.currentComments.findIndex((comment) => comment._id === action.payload), 1)
      },
      edit: (state, action) => {
        const commentIndex = state.currentComments.findIndex((comment) => comment._id === action.payload._id);
        state.currentComments[commentIndex].description = action.payload.description;
      }
    }
  })

  export const { fetchStart, fetchSuccess, fetchFailure, add, remove, edit } = CommentsSlice.actions

  export default CommentsSlice.reducer