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
export const fetchProfiles = () => api.get('/profile');

export const fetchSpecialists = () => api.get('/healthpros');

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
export const getPregnancyInfo = async () => {
  const response = await api.get('/mums/pregnancy-info');
  return response.data;
};

export const getMumEvents = async () => {
  const response = await api.get('/mums/events');
  return response.data.events;
};

export const addMumEvent = async (eventData) => {
  const response = await api.post('/mums/events', eventData);
  return response.data;
};


export const addReminder = async (reminderData) => {
  const response = await api.post('/mums/reminder', reminderData); // ✅ Correct
  return response.data.event;
};

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
  return response.data.events || []; // ✅ return the array directly
};


export const requestVerification = () =>
  api.post('/healthpro/request-verification', {});


export const getUploads = async () => {
  const response = await api.get('/uploads');
  return response.data;
};
// MUM Questions
export const getMumQuestions = async () => {
  const response = await api.get('/mums/questions');
  return response.data;
};

export const createMumQuestion = async (questionData) => {
  const response = await api.post('/mums/questions', questionData);
  return response.data;
};

export const updateMumQuestion = async (questionData) => {
  const response = await api.patch('/mums/questions', questionData);
  return response.data;
};

export const registerMum = async (data) => {
  const response = await api.post('/mums/register', data);
  return response.data;
};
export const getScans = () => api.get('/mums/scans');
export const getDoctors = () => api.get('/healthpros');
export const uploadScan = (formData) =>
  api.post('/mums/upload_scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });




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
export const updateUserProfile = async (profileData) => {
  const response = await api.patch('/profile/update', profileData);
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
// export const createCommunityPost = async (id, formData) => {
//   const response = await api.post(`/communities/${id}/posts`, formData);
//   return response.data;
// };
export const createCommunityPost = async (communityId, formData) => {
  const response = await api.post(`/communities/${communityId}/posts`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
  const res = await axios.get(`/healthpros/scans/${id}`);
  return res.data;
};

// export const fetchUploadsByHealthProId = async (id) => {
//   const response = await api.get(`/uploads/healthpro/${id}`);
//   return response.data;
// };

export const fetchFlaggedArticles = async () => {
  const response = await api.get(`/articles/flagged`);
  return response.data;
};
export const fetchAllSpecialists = async () => {
  const response = await api.get('/healthpros');
  return response.data;
};

export const fetchRecentArticles = async (limit = 5) => {
  const response = await api.get('/articles', { params: { limit } });
  return response.data;
};

// Fetch group posts with comments
export const fetchHealthProGroupPosts = async () => {
  const response = await api.get('/healthpro/group-posts-with-comments');
  return response.data.posts;
};

// Flag a post as misinformation
export const flagPost = async (postId) => {
  const response = await api.post(`/flag-post/${postId}`);
  return response.data;
};
export const getArticleById = async (id) => {
  const response = await api.get(`/articles/${id}`);
  return response.data.article;
};
// Admin notifications
export const fetchAdminNotifications = async () => {
  const response = await api.get('/admin/notifications');
  return response.data.notifications;
};

// Approve health professional
export const approveHealthProfessional = async (userId) => {
  const response = await api.post(`/admin/approve_healthpro/${userId}`);
  return response.data;
};

// Reject health professional
export const rejectHealthProfessional = async (userId) => {
  const response = await api.post(`/admin/reject_healthpro/${userId}`);
  return response.data;
};
export const fetchCategories = async () => {
  const response = await api.get('/admin/categories');
  return response.data.categories;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/admin/create_category', categoryData);
  return response.data;
};

// Add new category
export const addCategory = async (categoryData) => {
  const response = await api.post('/admin/categories', categoryData);
  return response.data.category;
};

// Delete a category
export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};
export const deactivateUser = async (userId) => {
  const response = await api.patch(`/admin/deactivate/${userId}`);
  return response.data;
};

export const activateUser = async (userId) => {
  const response = await api.patch(`/admin/activate/${userId}`);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/delete_user/${userId}`);
  return response.data;
};

export const resetUserPasswordById = async (userId) => {
  const response = await api.post(`/admin/reset_password/${userId}`);
  return response.data;
};

export const approveHealthPro = async (userId) => {
  const response = await api.post(`/admin/approve_healthpro/${userId}`);
  return response.data;
};

export const promoteUserToAdmin = async (userId) => {
  const response = await api.patch(`/admin/promote/${userId}`);
  return response.data;
};

export default api;
