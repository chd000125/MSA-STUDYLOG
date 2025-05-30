// 예시: src/api/todoApi.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:8123/api/todos";

export const getTodos = () => axios.get(API_BASE_URL);
export const createTodo = (todo) => axios.post(API_BASE_URL, todo);
export const updateTodo = (id, todo) => axios.put(`${API_BASE_URL}/${id}`, todo);
export const deleteTodo = (id) => axios.delete(`${API_BASE_URL}/${id}`);