// src/lib/api.js
import axios from 'axios';

const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://mama-africa.onrender.com'; // Replace with your actual Flask API URL

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔒 Authentication
export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
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

// 📄 Profiles
export const getProfiles = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateMumProfile = async (profileData) => {
  const response = await api.post('/mums/profile', profileData);
  return response.data;
};

export const getHealthPros = async () => {
  const response = await api.get('/healthpros');
  return response.data;
};

export const registerHealthPro = async (userData) => {
  const response = await api.post('/healthpros/register', userData);
  return response.data;
};

export const getHealthProMe = async () => {
  const response = await api.get('/healthpros/me');
  return response.data;
};

// ✅ NEW: Submit request for verification from health professional
export const requestVerification = async () => {
  const response = await api.post('/healthpro/request-verification');
  return response.data;
};

// ✅ NEW: Admin approves health professional verification
export const approveHealthPro = async (userId) => {
  const response = await api.post(`/admin/approve_healthpro/${userId}`);
  return response.data;
};

export const submitHealthProArticle = async (articleData) => {
  const response = await api.post('/healthpros/articles', articleData);
  return response.data;
};

export const answerQuestion = async (answerData) => {
  const response = await api.post('/healthpros/answers', answerData);
  return response.data;
};

export const recommendClinic = async (clinicData) => {
  const response = await api.post('/healthpros/recommendations', clinicData);
  return response.data;
};

export const getCommunities = async (trimester) => {
  const response = await api.get('/communities', { params: { trimester } });
  return response.data;
};

export const getCommunityPosts = async (communityId) => {
  const response = await api.get(`/mums/communities/${communityId}/posts`);
  return response.data;
};

export const createCommunityPost = async (communityId, postData) => {
  const response = await api.post(`/mums/communities/${communityId}/post`, postData);
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

export const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const commentOnPost = async (postId, commentData) => {
  const response = await api.post(`/mums/communities/posts/${postId}/comment`, commentData);
  return response.data;
};

export const getArticles = async () => {
  const response = await api.get('/articles');
  return response.data;
};

export const getArticleComments = async (articleId) => {
  const response = await api.get(`/articles/${articleId}/comments`);
  return response.data;
};

export const commentOnArticle = async (articleId, commentData) => {
  const response = await api.post(`/mums/articles/${articleId}/comment`, commentData);
  return response.data;
};

export const getComments = async () => {
  const response = await api.get('/comments');
  return response.data;
};

export const createComment = async (articleId, commentData) => {
  const response = await api.post(`/mums/articles/${articleId}/comment`, commentData);
  return response.data;
};

export const replyToComment = async (commentId, replyData) => {
  const response = await api.post(`/mums/comments/${commentId}/reply`, replyData);
  return response.data;
};

export const voteOnComment = async (commentId, voteData) => {
  const response = await api.post(`/mums/comments/${commentId}/vote`, voteData);
  return response.data;
};

export const askQuestion = async (questionData) => {
  const response = await api.post('/mums/questions', questionData);
  return response.data;
};

export const getQuestions = async (options = {}) => {
  const { own, userId } = options;
  const response = await api.get('/mums/questions', { params: { own, user_id: userId } });
  return response.data;
};

export const commentOnQuestion = async (questionId, commentData) => {
  const response = await api.post(`/mums/questions/${questionId}/comments`, commentData);
  return response.data;
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

export const getClinics = async () => {
  const response = await api.get('/clinics');
  return response.data;
};

export const getChats = async (userId, receiverId, page = 1, limit = 50) => {
  const response = await api.get('/chats', { params: { user_id: userId, receiver_id: receiverId, page, limit } });
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/chats', messageData);
  return response.data;
};

export const reportMessage = async (messageId, reportData) => {
  const response = await api.post(`/admin/report_message/${messageId}`, reportData);
  return response.data;
};

export const sendTypingIndicator = async (typingData) => {
  return Promise.resolve();
};

export const shareContent = async (contentType, contentId) => {
  const response = await api.post('/mums/share', { content_type: contentType, content_id: contentId });
  return response.data;
};

export const shareViaEmail = async (contentType, contentId, recipientEmail) => {
  const response = await api.post('/mums/share/email', { content_type: contentType, content_id: contentId, recipient_email: recipientEmail });
  return response.data;
};

export const shareViaInbox = async (shareData) => {
  const response = await api.post('/mums/share/inbox', shareData);
  return response.data;
};

export const followThread = async (threadId) => {
  const response = await api.post(`/mums/threads/${threadId}/follow`);
  return response.data;
};

export const addUser = async (userData) => {
  const response = await api.post('/admin/add_user', userData);
  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await api.patch(`/admin/deactivate_user/${userId}`);
  return response.data;
};

export const removeContent = async (contentId) => {
  const response = await api.delete(`/admin/remove_content/${contentId}`);
  return response.data;
};

export const approveContent = async (contentId) => {
  const response = await api.post(`/admin/approve_content/${contentId}`);
  return response.data;
};

export const addCategory = async (categoryData) => {
  const response = await api.post('/admin/add_category', categoryData);
  return response.data;
};

export const approveArticle = async (articleId) => {
  const response = await api.post(`/admin/approve_article/${articleId}`);
  return response.data;
};

export const addCommunity = async (communityData) => {
  const response = await api.post('/admin/add_community', communityData);
  return response.data;
};

export const getTopics = async () => {
  const response = await api.get('/topics');
  return response.data;
};

export const searchTopics = async ({ query }) => {
  const response = await api.get('/topics/search', { params: { query } });
  return response.data;
};

export const getTopic = async (topicId) => {
  const response = await api.get(`/topics/${topicId}`);
  return response.data;
};

export const getTopicContent = async (topicId, contentType = 'all') => {
  const response = await api.get(`/topics/${topicId}/content`, {
    params: { type: contentType }
  });
  return response.data;
};

export const followTopic = async (topicId) => {
  const response = await api.post(`/topics/${topicId}/follow`);
  return response.data;
};

export const unfollowTopic = async (topicId) => {
  const response = await api.post(`/topics/${topicId}/unfollow`);
  return response.data;
};

export const getFollowedTopics = async () => {
  const response = await api.get('/topics/followed');
  return response.data;
};

export const getShareLink = async (contentType, contentId) => {
  const response = await api.get('/share/link', {
    params: { content_type: contentType, content_id: contentId }
  });
  return response.data;
};

export const getTrimesterCommunities = async (trimester) => {
  const response = await api.get('/communities', {
    params: { trimester }
  });
  return response.data;
};

// export const getJoinedCommunities = async () => {
//   const response = await api.get('/communities/joined');
//   return response.data;
// };
export const getJoinedCommunities = async () => {
  const token = localStorage.getItem("access_token");
  const response = await api.get('/mums/communities/joined', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

api.leaveCommunity = leaveCommunity;
api.joinCommunity = joinCommunity;
api.getJoinedCommunities = getJoinedCommunities;

export default api;
