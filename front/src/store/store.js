import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// 리덕스 스토어 생성
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
