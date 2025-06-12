import api from './api';
const getMessages = (groupId) => api.get(`/messages/${groupId}`);
const postMessage = (groupId, messageData) => api.post(`/messages/${groupId}`, messageData);

const messageService = { getMessages, postMessage };
export default messageService;
