import { createSlice } from '@reduxjs/toolkit'


const initialState =
{
    currentVideo: null,
    loading: false,
    error: false
}

export const VideoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
      fetchStart: (state) =>
      {
        state.loading = true
      },
      fetchSuccess: (state, action) =>
      {
        state.loading = false
        state.currentVideo = action.payload
      },
      fetchFailure: (state) =>
      {
        state.loading = false
        state.error = true
      },
      like: (state, action) =>
      {
        if (!state.currentVideo.likes.includes(action.payload)) //Payload is the user's ID
        {
          state.currentVideo.likes.push(action.payload)
          state.currentVideo.dislikes.splice(state.currentVideo.dislikes.findIndex((userID) => userID === action.payload), 1) //Checking if user disliked current video and removing the dislike when user likes the video.
        }
      },
      dislike: (state, action) =>
      {
        if (!state.currentVideo.dislikes.includes(action.payload)) //Payload is the user's ID
        {
          state.currentVideo.dislikes.push(action.payload)
          state.currentVideo.likes.splice(state.currentVideo.likes.findIndex((userID) => userID === action.payload), 1) //Checking if user disliked current video and removing the dislike when user likes the video.
        }
      },
      remove: (state) =>
      {
        state.currentVideo = null
      }
    }
  })

  export const { fetchStart, fetchSuccess, fetchFailure, like, dislike, remove } = VideoSlice.actions

  export default VideoSlice.reducer