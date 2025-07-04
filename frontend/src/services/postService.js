import api from './api';

const getPosts = () => {
    return api.get('/posts');
};

const createPost = (postData) => {
    return api.post('/posts', postData);
};

const updatePost = (id, postData) => {
    return api.put(`/posts/${id}`, postData);
};
const getPostById = (postId) => api.get(`/posts/${postId}`);
const likePost = (postId) => api.put(`/posts/${postId}/like`);
const deletePost = (id) => {
    return api.delete(`/posts/${id}`);
};

// Admin
// const getPendingPosts = () => {
//     return api.get('/posts/pending');
// };

// const approvePost = (id) => {
//     return api.put(`/posts/approve/${id}`);
// };
const addComment = (postId, commentData) => api.post(`/posts/${postId}/comment`, commentData);
//const deleteComment = (postId, commentId) => api.delete(`/posts/${postId}/comment/${commentId}`);


const postService = {
    getPosts,
    createPost,
    updatePost,
    deletePost,
    addComment,
    getPostById,
    likePost
};

export default postService;

