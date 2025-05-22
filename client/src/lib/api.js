// src/lib/api.js
import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

// Auto-add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------- AUTH --------------------
export const signup = async (formData) => {
  const response = await api.post('/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/me');
  return response.data;
};

// -------------------- USER PROFILE --------------------
export const getProfiles = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateMumProfile = async (profileData) => {
  const response = await api.post('/mums/profile', profileData);
  return response.data;
};

// -------------------- ADMIN --------------------
export const getAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const addAdminUser = async (formData) => {
  const response = await api.post('/admin/add_user', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getAdminArticles = async () => {
  const response = await api.get('/admin/articles');
  return response.data;
};

export const handleArticleAction = async (id, action) => {
  let endpoint = '';
  let method = 'PATCH';

  if (action === 'approved') {
    endpoint = `/admin/approve_article/${id}`;
  } else if (action === 'flagged') {
    endpoint = `/admin/flag_article/${id}`;
  } else if (action === 'deleted') {
    endpoint = `/admin/delete_article/${id}`;
    method = 'DELETE';
  }

  const response = await api({
    method,
    url: endpoint,
  });

  return response.data;
};

export const getFlaggedItems = async () => {
  const response = await api.get('/flags');
  return response.data.flags;
};

export const getFlaggedPost = async (id) => {
  const response = await api.get(`/admin/posts/${id}`);
  return response.data.post;
};

export const getFlaggedComment = async (id) => {
  const response = await api.get(`/admin/comments/${id}`);
  return response.data.comment;
};

export const updateFlagStatus = async (flagId) => {
  const response = await api.patch(`/flags/${flagId}`);
  return response.data;
};

export const updatePostOrCommentStatus = async (type, id, status) => {
  const endpoint = type === 'post' ? 'posts' : 'comments';
  const response = await api.patch(`/admin/${endpoint}/${id}`, { status });
  return response.data;
};

// -------------------- MUMS --------------------
export const getPregnancyDetails = async () => {
  const response = await api.get('/mums/pregnancy');
  return response.data;
};

export const addPregnancyDetails = async (pregnancyData) => {
  const response = await api.post('/mums/pregnancy', pregnancyData);
  return response.data;
};

export const getFetalDevelopment = async () => {
  const response = await api.get('/mums/fetal_development');
  return response.data;
};

export const getReminders = async () => {
  const response = await api.get('/mums/reminders');
  return response.data;
};

export const uploadScan = async (uploadData) => {
  const response = await api.post('/mums/upload_scan', uploadData);
  return response.data;
};

export const getUploads = async () => {
  const response = await api.get('/uploads');
  return response.data;
};

// -------------------- HEALTH PROFESSIONAL --------------------
export const getHealthProProfile = async () => {
  const response = await api.get('/me');
  return response.data;
};

export const getHealthProArticles = async () => {
  const response = await api.get('/healthpros/articles');
  return response.data;
};

export const getHealthProQuestions = async () => {
  const response = await api.get('/healthpros/questions');
  return response.data;
};

export const postHealthProArticle = async (articleData) => {
  const response = await api.post('/healthpros/articles', articleData);
  return response.data;
};

export const updateHealthProProfile = async (profileData) => {
  const response = await api.post('/healthpros/profile', profileData);
  return response.data;
};

export const requestHealthProVerification = async () => {
  const response = await api.post('/healthpro/request-verification');
  return response.data;
};
export const submitHealthProAnswer = async (question_id, answer_text) => {
  const response = await api.post('/healthpros/answers', { question_id, answer_text });
  return response.data;
};

export const getHealthProScans = async () => {
  const response = await api.get('/scans');
  return response.data;
};

export const uploadHealthProScan = async (formData) => {
  const response = await api.post('/upload_scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


export const getClinics = async () => {
  const response = await api.get('/clinics');
  return response.data;
};

export const addClinic = async (clinicData) => {
  const response = await api.post('/clinics', clinicData);
  return response.data;
};

export const toggleClinicRecommendation = async (clinicId) => {
  const response = await api.patch(`/clinics/${clinicId}/recommend`);
  return response.data;
};
// -------------------- HEALTHPRO EVENTS --------------------
export const fetchHealthProEvents = async () => {
  const response = await api.get('/healthpros/events');
  return response.data.events;
};

export const createHealthProEvent = async (eventData) => {
  const response = await api.post('/healthpros/events', eventData);
  return response.data.event;
};

// -------------------- COMMUNITY MODERATION --------------------
export const getPendingCommunities = async () => {
  const response = await api.get('/admin/communities/pending');
  return response.data.communities;
};

export const updateCommunityStatus = async (id, status) => {
  const response = await api.patch(`/communities/${id}`, { status });
  return response.data;
};

export const createCommunity = async (data) => {
  const response = await api.post('/admin/create_community', data);
  return response.data;
};

export const resetUserPassword = async (email) => {
  const response = await api.post('/admin/reset_password', { email });
  return response.data;
};

// -------------------- COMMUNITIES --------------------
export const fetchCommunities = async (trimester = 'all') => {
  const response = await api.get('/communities', {
    params: trimester !== 'all' ? { trimester } : {},
  });
  return response.data.communities;
};

export const fetchCommunityPosts = async (communityId) => {
  const response = await api.get(`/communities/${communityId}/posts`);
  return response.data.posts;
};

export const getCommunities = async (trimester) => {
  const response = await api.get('/communities', { params: { trimester } });
  return response.data;
};

export const getJoinedCommunities = async () => {
  const response = await api.get('/mums/communities/joined');
  return response.data;
};

export const joinCommunity = async (communityId) => {
  const response = await api.post(`/mums/communities/${communityId}/join`);
  return response.data;
};

export const leaveCommunity = async (communityId) => {
  const response = await api.post(`/mums/communities/${communityId}/leave`);
  return response.data;
};

// Fetch single community and posts
export const getCommunityById = async (id) => {
  const response = await api.get(`/communities/${id}`);
  return response.data.community;
};

export const getCommunityPosts = async (id) => {
  const response = await api.get(`/communities/${id}/posts`);
  return response.data.posts;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response.data;
};

// Join/leave a community
export const joinCommunityById = async (id) => {
  const response = await api.post(`/communities/${id}/join`);
  return response.data;
};

export const leaveCommunityById = async (id) => {
  const response = await api.post(`/communities/${id}/leave`);
  return response.data;
};

// My posts
export const getMyPosts = async () => {
  const response = await api.get('/my-posts');
  return response.data;
};

// Post actions
export const createCommunityPost = async (id, formData) => {
  const response = await api.post(`/communities/${id}/posts`, formData);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

// Comments
export const createComment = async (postId, data) => {
  const response = await api.post(`/posts/${postId}/comments`, data);
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

//--------------------- Health Pro general page --------------------
export const fetchHealthProById = async (id) => {
  const response = await api.get(`/healthpros/${id}`);
  return response.data;
};

export const fetchArticlesByAuthorId = async (id) => {
  const response = await api.get(`/articles/author/${id}`);
  return response.data;
};

export const fetchClinicsByHealthProId = async (id) => {
  const response = await api.get(`/clinics/healthpro/${id}`);
  return response.data;
};

export const fetchUploadsByHealthProId = async (id) => {
  const response = await api.get(`/uploads/healthpro/${id}`);
  return response.data;
};

export const fetchFlaggedArticles = async () => {
  const response = await api.get(`/articles/flagged`);
  return response.data;
};


export default api;
