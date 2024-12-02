import { Api } from './Api';

export const api = new Api({
    baseURL: 'http://localhost:8000/',
    withCredentials: true,
});