import axios from 'axios';

const API_BASE_URL = 'http://localhost:3030/users';

class UserService {
    async getUsers() {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    }
    async createUser(user) {
        const response = await axios.post(API_BASE_URL, user);
        return response.data;
    }
    async getUserById(id) {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    }
    async updateUser(user) {
        const response = await axios.put(`${API_BASE_URL}/${user.id}`, user);
        return response.data;
    }
    async deleteUser(id) {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    }
}

const userService = new UserService();
export default userService;
