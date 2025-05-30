import axios from 'axios';

// API 클라이언트
const apiClient = axios.create({
  baseURL: 'http://localhost:9090/api',
  withCredentials: true,
});

// 인터셉터 설정
const setupInterceptors = (api) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      
      // 토큰이 필요 없는 경로 목록
      const publicPaths = [
        '/auth/login',
        '/auth/register',
        '/auth/register/request',
        '/mail/send-verification',
        '/mail/verify-code',
        '/users/password/reset',
        '/auth/refresh'
      ];

      // 현재 요청 경로가 publicPaths에 포함되지 않고 토큰이 있을 경우에만 Authorization 헤더 추가
      const isPublicPath = publicPaths.some(path => config.url.includes(path));

      if (token && !isPublicPath) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // 토큰 만료 에러 처리 (401 에러)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const res = await apiClient.post('/auth/refresh', null, { withCredentials: true });
          const newAccessToken = res.data.accessToken;

          if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // 403 에러 처리
      if (error.response?.status === 403) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
};

// 인터셉터 설정 적용
setupInterceptors(apiClient);

// API 요청 함수들
export const API = {
  // 인증 관련 API
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    refresh: () => apiClient.post('/auth/refresh'),
    requestRegister: (data) => apiClient.post('/auth/register/request', data, {headers: { "Content-Type": "application/json" }, withCredentials: true}),
    requestRegisterComplete: (data) =>
        apiClient.post('/auth/register', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        }),
    sendVerificationCode: (uEmail) => apiClient.post(`/mail/send-verification?email=${encodeURIComponent(uEmail)}`),
    verifyCode: (uEmail, code) => apiClient.post(`/mail/verify-code?email=${encodeURIComponent(uEmail)}&code=${encodeURIComponent(code)}`),
  },

  // 사용자 관련 API
  user: {
    getProfile: () => apiClient.get('/users/profile/me'),
    getUserInfo: () => apiClient.get('/users/profile/me'),
    updateName: (newUName) => {
      const uName = typeof newUName === 'object' && newUName.uName ? newUName.uName : newUName;
      return apiClient.put('/users/profile/name', { uName });
    },
    resetPassword: (data) => apiClient.post('/users/password/reset', data),
    checkPassword: (data) => apiClient.post('/users/password/check', data),
    verifyPassword: (data) => apiClient.post('/users/verify-password', data),
    deactivateAccount: (data) => apiClient.put('/users/state/deactivate', null, { params: { uEmail: data.uEmail } }),
    reactivateAccount: () => apiClient.put('/users/state/reactivate'),
    deleteAccount: () => apiClient.delete('/users/profile'),
    restoreAccount: (uEmail) => apiClient.post('/users/state/reactivate', null, { params: { uEmail } }),
    requestDeleteAccount: (uEmail) => apiClient.post('/users/account/delete', {}, { headers: { 'X-User-Email': uEmail } }),
  },

  // 관리자 관련 API
  admin: {
    getUsers: (page = 0, size = 10, uId = '', uName = '', uEmail = '') => {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);
      if (uId) params.append('uId', uId);
      if (uName) params.append('uName', uName);
      if (uEmail) params.append('uEmail', uEmail);
      return apiClient.get(`/admin/users?${params.toString()}`);
    },
    createUser: (userData) => apiClient.post('/admin/users', userData),
    updateUser: (userId, userData) => apiClient.put(`/admin/users/${userId}`, userData),
    deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
    updateUserRole: (userId, role) => apiClient.put(`/admin/users/${userId}/role`, { role }),
    restoreUser: (userId) => apiClient.put(`/admin/users/${userId}/restore`),
    getStudyGroups: (page = 0, size = 100) => apiClient.get('/admin/study-groups', { params: { page, size } }),
    deleteStudyGroup: (id) => apiClient.delete(`/admin/study-groups/${id}`),
  }
};

export default API; 