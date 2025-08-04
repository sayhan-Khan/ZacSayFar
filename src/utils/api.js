// API configuration and utility functions
const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Authentication API calls
export const authAPI = {
  // Login user
  login: async (email, password) => {
    return apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Register new user
  register: async (userData) => {
    return apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Food API calls
export const foodAPI = {
  // Get all foods
  getAllFoods: async () => {
    const url = 'http://localhost:5000/foods';
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch foods');
      }
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },

  // Add meal to user storage
  addMeal: async (email, foodName, quantity) => {
    return apiCall('/add-meal', {
      method: 'POST',
      body: JSON.stringify({ email, foodName, quantity }),
    });
  },

  // Get user meals
  getUserMeals: async (email) => {
    const url = `${API_BASE_URL}/user-meals?email=${encodeURIComponent(email)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user meals');
      }
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },
};

export default { authAPI, foodAPI };
