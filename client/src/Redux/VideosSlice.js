import { createSlice } from '@reduxjs/toolkit'


const initialState =
{
    currentVideos: null,
    loading: false,
    error: false
}

export const VideosSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
      fetchStart: (state) =>
      {
        state.loading = true
      },
      fetchSuccess: (state, action) =>
      {
        state.loading = false
        state.currentVideos = action.payload
      },
      fetchFailure: (state) =>
      {
        state.loading = false
        state.error = true
      },
      remove: (state, action) => {
        if (state.currentVideos) state.currentVideos.splice(state.currentVideos.findIndex((video) => video._id === action.payload), 1)
      }
    }
  })

  export const { fetchStart, fetchSuccess, fetchFailure, remove } = VideosSlice.actions

  export default VideosSlice.reducer