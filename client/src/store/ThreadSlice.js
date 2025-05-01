// src/store/ThreadSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  api  from '../lib/api';

export const fetchThreads = createAsyncThunk(
  'thread/fetchThreads',
  async (communityId) => {
    const response = await api.getThreads(communityId);
    return response.data;
  }
);

export const createThread = createAsyncThunk(
  'thread/createThread',
  async (threadData) => {
    const response = await api.createThread(threadData.community_id, threadData);
    return response.data;
  }
);

export const createComment = createAsyncThunk(
  'thread/createComment',
  async (commentData) => {
    const response = await api.createComment(commentData.thread_id, commentData);
    return { threadId: commentData.thread_id, comment: response.data };
  }
);

export const replyToComment = createAsyncThunk(
  'thread/replyToComment',
  async ({ commentId, reply }) => {
    const response = await api.replyToComment(commentId, reply);
    return { commentId, reply: response.data };
  }
);

export const voteOnComment = createAsyncThunk(
  'thread/voteOnComment',
  async ({ commentId, voteType }) => {
    const response = await api.voteOnComment(commentId, voteType);
    return { commentId, voteType, votes: response.data };
  }
);

export const followThread = createAsyncThunk(
  'thread/followThread',
  async (threadId) => {
    const response = await api.followThread(threadId);
    return { threadId, ...response.data };
  }
);

const threadSlice = createSlice({
  name: 'thread',
  initialState: {
    threads: [],
    followedThreads: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.push(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const thread = state.threads.find(t => t.id === action.payload.threadId);
        if (thread) {
          thread.comments = thread.comments || [];
          thread.comments.push(action.payload.comment);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(replyToComment.fulfilled, (state, action) => {
        const findComment = (comments, commentId) => {
          for (let comment of comments) {
            if (comment.id === commentId) return comment;
            if (comment.replies) {
              const found = findComment(comment.replies, commentId);
              if (found) return found;
            }
          }
          return null;
        };

        state.threads.forEach(thread => {
          const comment = findComment(thread.comments || [], action.payload.commentId);
          if (comment) {
            comment.replies = comment.replies || [];
            comment.replies.push(action.payload.reply);
          }
        });
      })
      .addCase(voteOnComment.fulfilled, (state, action) => {
        const findComment = (comments, commentId) => {
          for (let comment of comments) {
            if (comment.id === commentId) return comment;
            if (comment.replies) {
              const found = findComment(comment.replies, commentId);
              if (found) return found;
            }
          }
          return null;
        };

        state.threads.forEach(thread => {
          const comment = findComment(thread.comments || [], action.payload.commentId);
          if (comment) {
            comment.upvotes = action.payload.votes.upvotes;
            comment.downvotes = action.payload.votes.downvotes;
          }
        });
      })
      .addCase(followThread.fulfilled, (state, action) => {
        state.followedThreads.push(action.payload.threadId);
      });
  },
});

export default threadSlice.reducer;