import { createSlice } from '@reduxjs/toolkit'


const initialState =
{
    currentChannel: null,
    loading: false,
    error: false
}

export const ChannelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
      fetchStart: (state) =>
      {
        state.loading = true
      },
      fetchSuccess: (state, action) =>
      {
        state.loading = false
        state.currentChannel = action.payload
      },
      fetchFailure: (state) =>
      {
        state.loading = false
        state.error = true
        state.currentChannel = null
      },
      remove: (state) =>
      {
        state.currentChannel = null
      }
    }
  })

  export const { fetchStart, fetchSuccess, fetchFailure, remove } = ChannelSlice.actions

  export default ChannelSlice.reducer