import { createSlice } from '@reduxjs/toolkit'


const initialState =
{
    currentUser: null,
    loginLoading: false,
    signupLoading: false,
    googleLoading: false,
    error: false
}

export const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      loginStart: (state) =>
      {
        state.loginLoading = true
      },
      signupStart: (state) =>
      {
        state.signupLoading = true
      },
      googleStart: (state) =>
      {
        state.googleLoading = true
      },
      loginSuccess: (state, action) =>
      {
        state.loginLoading = false
        state.signupLoading = false
        state.googleLoading = false
        state.currentUser = action.payload
        console.log('login success')
      },
      signupSuccess: (state) =>
      {
        state.loginLoading = false
        state.signupLoading = false
        state.googleLoading = false
        console.log('signup success')
      },
      loginFailure: (state) =>
      {
        state.loginLoading = false
        state.signupLoading = false
        state.googleLoading = false
        state.error = true
        console.log('login failure')

      },
      logout: () =>
      {
        return initialState
      },
      favourites: (state, action) =>
      {
        if (state.currentUser.favourites.some(favourite => favourite._id === action.payload._id)) state.currentUser.favourites = state.currentUser.favourites.filter(favourite => favourite._id !== action.payload._id);
        else state.currentUser.favourites.unshift(action.payload)
      },
      newFavourites: (state, action) =>
      {
        state.currentUser.favourites = [...action.payload];
      },
      posts: (state, action) =>
      {
        if (state.currentUser.posts.some(posts => posts._id === action.payload._id)) state.currentUser.posts = state.currentUser.posts.filter(post => post._id !== action.payload._id);
        else state.currentUser.posts.unshift(action.payload)
      },
      newPosts: (state, action) =>
      {
        state.currentUser.posts = [...action.payload];
      },
      changeName: (state, action) =>
      {
        state.currentUser.username = action.payload
      },
      changePic: (state, action) =>
      {
        state.currentUser.image = action.payload
      }
    },
  })

  export const { loginStart, signupStart, googleStart, loginSuccess, signupSuccess, loginFailure, logout, favourites, newFavourites, posts, newPosts, changeName, changePic } = UserSlice.actions

  export default UserSlice.reducer