import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../utils/api';

function AdminPanel() {
  const [adminUsername, setAdminUsername] = useState('admin@admin.com');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const usersData = await adminAPI.getAllUsers(adminUsername, adminPassword);
      setUsers(usersData);
    } catch (err) {
      setMessage(`Failed to load users: ${err.message}`);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      setMessage('Username and password are required');
      return;
    }

    try {
      await adminAPI.addUser(adminUsername, adminPassword, newUsername, newPassword);
      setMessage(`User ${newUsername} added successfully!`);
      setNewUsername('');
      setNewPassword('');
      loadUsers(); // Refresh user list
    } catch (err) {
      setMessage(`Failed to add user: ${err.message}`);
    }
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await adminAPI.deleteUser(adminUsername, adminPassword, username);
        setMessage(`User ${username} deleted successfully!`);
        loadUsers(); // Refresh user list
      } catch (err) {
        setMessage(`Failed to delete user: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-zinc-900 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="text-2xl font-bold text-white hover:text-emerald-400">
              College Eats Admin
            </Link>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                User Management
              </button>
              <Link to="/dashboard" className="text-gray-300 hover:text-white px-4 py-2">
                Dashboard
              </Link>
              <Link to="/add-meal" className="text-gray-300 hover:text-white px-4 py-2">
                Add Meal
              </Link>
              <Link to="/history" className="text-gray-300 hover:text-white px-4 py-2">
                History
              </Link>
              <Link to="/nutrition" className="text-gray-300 hover:text-white px-4 py-2">
                Nutrition
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Admin: {adminUsername}</span>
            <Link to="/login" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h2>
          <p className="text-gray-600">Manage users and oversee the College Eats application</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
            <button 
              onClick={() => setMessage('')}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">All Users</h3>
                <button
                  onClick={loadUsers}
                  disabled={isLoadingUsers}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
                >
                  {isLoadingUsers ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {isLoadingUsers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{user.username}</h4>
                        <p className="text-sm text-gray-600">User ID: {user.id}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add User Form */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email/Username
                  </label>
                  <input
                    type="email"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter user email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter password"
                  />
                </div>

                <button
                  onClick={handleAddUser}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Add User
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Users</span>
                  <span className="font-semibold text-emerald-600">{users.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Admin Users</span>
                  <span className="font-semibold text-blue-600">
                    {users.filter(user => user.username.startsWith('admin')).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Regular Users</span>
                  <span className="font-semibold text-gray-600">
                    {users.filter(user => !user.username.startsWith('admin')).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;