import api from './api';
const getTodaysBirthdays = () => api.get('/users/birthdays/today');
const getAlumniDirectory = (params) => api.get('/users', { params });
const getUserProfile = () => api.get('/auth/me');
const updateProfile = (profileData) => api.put('/users/profile', profileData);
// Function to update profile picture
const updateProfilePicture = (formData) => api.put('/users/profile/picture', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
const getPendingUsers = () => api.get('/users/pending');
const approveUser = (id) => api.put(`/users/approve/${id}`);
const deleteUser = (id) => api.delete(`/users/${id}`);

const userService = { getTodaysBirthdays, getAlumniDirectory, getUserProfile, updateProfile, updateProfilePicture, getPendingUsers, approveUser, deleteUser };
export default userService;