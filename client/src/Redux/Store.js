import { configureStore, combineReducers } from '@reduxjs/toolkit'
import UserReducer from './UserSlice'
import VideoReducer from './VideoSlice'
import CommentsReducer from './CommentsSlice'
import VideosReducer from './VideosSlice'
import ChannelReducer from './ChannelSlice'



import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({user: UserReducer, video: VideoReducer, comments: CommentsReducer, videos: VideosReducer, channel: ChannelReducer}) //Combining reducers into one 'root reducer'
const persistedReducer = persistReducer(persistConfig, rootReducer) //Passing root reducer into this function so that state 'persists' (stays the same when page reloads)

export const store = configureStore({
  reducer: persistedReducer,

  //Middlewear needed to prevent errors for 'redux-persist'
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    }
  })
})

export const persistor = persistStore(store)