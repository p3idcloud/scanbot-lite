import axios from './index';

axios.interceptors.request.use((request) => {
    const token = localStorage.getItem('token');
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }
    request.baseURL = process.env.baseUrl;
    return request;
});

export const getProfileDefinition = () => axios.get(`/api/profiledefinition`);

export const getScannerSettings = () => axios.get(`/api/scannersetting`);

export const updateProfileDefinition = (data) => axios.patch(`/api/profiledefinition/${data.id}`, data);

export const createProfileDefinition = (data) => axios.post(`/api/profiledefinition`, data);

export const removeProfileDefinition = (data) => axios.delete(`/api/profiledefinition/${data.id}`);