const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
async function apiCall(endpoint, options = {}) {
  console.log(`API Call Triggered → ${endpoint}`, options);
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
  login: async (email, password) => {
    return apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (userData) => {
    return apiCall('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Food API calls
export const foodAPI = {
  getAllFoods: async () => {
    return apiCall('/foods', {
      method: 'GET',
    });
  },

  addMeal: async (email, foodName, quantity) => {
    return apiCall('/add-meal', {
      method: 'POST',
      body: JSON.stringify({ email, foodName, quantity }),
    });
  },

  getUserMeals: async (email) => {
    return apiCall(`/user-meals?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  },
};

export const adminAPI = {
  addUser: async (adminUsername, adminPassword, newUsername, newPassword) => {
    return apiCall('/admin/add-user', {
      method: 'POST',
      body: JSON.stringify({ adminUsername, adminPassword, newUsername, newPassword }),
    });
  },

  deleteUser: async (adminUsername, adminPassword, userToDelete) => {
    return apiCall('/admin/delete-user', {
      method: 'POST',
      body: JSON.stringify({ adminUsername, adminPassword, userToDelete }),
    });
  },
};

export default { authAPI, foodAPI, adminAPI };