import ax from 'axios';

const axios = ax.create({ baseURL: process.env.backendUrl });

export default axios;