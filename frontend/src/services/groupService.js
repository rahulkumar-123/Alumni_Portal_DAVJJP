import api from './api';
const getGroups = () => api.get('/groups');
const createGroup = (groupData) => api.post('/groups', groupData);
const joinGroup = (groupId) => api.put(`/groups/${groupId}/join`);
const getGroupDetails = (groupId) => api.get(`/groups/${groupId}`);

const groupService = { getGroups, createGroup, joinGroup, getGroupDetails };
export default groupService;
