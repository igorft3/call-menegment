import axios from 'axios';

const API_URL = 'https://api.skilla.ru/mango/';
const BEARER_TOKEN = 'testtoken';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
});
