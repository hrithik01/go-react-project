import axios from 'axios';

const API_BASE_URL = 'http://localhost:3030/users';

class UserService {
    async getUsers() {
        try {
            const response = await axios.get(API_BASE_URL);
            return response.data;
        } catch (error) {
            console.log("Error in UserService", error);
            throw error;
        }
    }
    async createUser(user) {
        try {
            const response = await axios.post(API_BASE_URL, user);
            return response.data;
        } catch (error) {
            console.log("Error in UserService", error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            console.log("response", response.data);
            return response.data;
        } catch (error) {
            console.log("Error in UserService", error);
            throw error;
        }
    }
    async updateUser(user) {
        try {
            const response = await axios.put(`${API_BASE_URL}/${user.id}`, user);
            return response.data;
        } catch (error) {
            console.log("Error in UserService", error);
            throw error;
        }
    }
    async deleteUser(id) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.log("Error in UserService", error);
            throw error;
        }
    }
}

const userService = new UserService();
export default userService;
