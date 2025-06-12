import api from './api';

const register = (userData) => {
    return api.post('/auth/register', userData);
};

const login = (credentials) => {
    return api.post('/auth/login', credentials);
};

const getMe = () => {
    return api.get('/auth/me');
};

const authService = {
    register,
    login,
    getMe,
};

export default authService;
