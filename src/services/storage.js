import { v4 as uuidv4 } from 'uuid';


const USERS_KEY = 'easy_portfolio_users';
const CURRENT_USER_KEY = 'easy_portfolio_current_user';
const DATA_KEY_PREFIX = 'easy_portfolio_data_';

export const storageService = {
    getUsers: () => {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    saveUser: (user) => {
        const users = storageService.getUsers();
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    findUser: (email) => {
        const users = storageService.getUsers();
        return users.find(u => u.email === email);
    },

    login: (email, password) => {
        const user = storageService.findUser(email);
        if (user && user.password === password) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return user;
        }
        throw new Error('Invalid credentials');
    },

    signup: (name, email, password) => {
        if (storageService.findUser(email)) {
            throw new Error('User already exists');
        }
        const newUser = { id: uuidv4(), name, email, password };
        storageService.saveUser(newUser);

        // Initialize with empty portfolio
        storageService.savePortfolio(newUser.id, []);

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        return newUser;
    },

    logout: () => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: () => {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    getPortfolio: (userId) => {
        const data = localStorage.getItem(DATA_KEY_PREFIX + userId);
        return data ? JSON.parse(data) : [];
    },

    savePortfolio: (userId, portfolio) => {
        localStorage.setItem(DATA_KEY_PREFIX + userId, JSON.stringify(portfolio));
    },

    // Password Reset Functions
    storeResetCode: (email, code) => {
        const resetData = {
            code,
            expiry: Date.now() + 15 * 60 * 1000 // 15 minutes from now
        };
        localStorage.setItem(`reset_code_${email}`, JSON.stringify(resetData));
    },

    verifyResetCode: (email, code) => {
        const resetDataStr = localStorage.getItem(`reset_code_${email}`);
        if (!resetDataStr) return false;

        const resetData = JSON.parse(resetDataStr);

        // Check if code has expired
        if (Date.now() > resetData.expiry) {
            localStorage.removeItem(`reset_code_${email}`);
            return false;
        }

        return resetData.code === code;
    },

    updateUserPassword: (email, newPassword) => {
        const users = storageService.getUsers();
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        users[userIndex].password = newPassword;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Clear reset code
        localStorage.removeItem(`reset_code_${email}`);

        return true;
    },

    clearResetCode: (email) => {
        localStorage.removeItem(`reset_code_${email}`);
    },

    // User Tour Functions
    hasSeenTour: (userId) => {
        const tourStatus = localStorage.getItem(`tour_completed_${userId}`);
        return tourStatus === 'true';
    },

    markTourComplete: (userId) => {
        localStorage.setItem(`tour_completed_${userId}`, 'true');
    },

    resetTour: (userId) => {
        localStorage.removeItem(`tour_completed_${userId}`);
    }
};
