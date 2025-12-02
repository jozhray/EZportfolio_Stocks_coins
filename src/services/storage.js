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
    }
};
