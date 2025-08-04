import { useState } from 'react';
import { adminAPI } from '../utils/api';

function AdminPanel() {
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState('');
  const [message, setMessage] = useState('');

  const handleAddUser = async () => {
    try {
      await adminAPI.addUser(adminUsername, adminPassword, newUsername, newPassword);
      setMessage(`User ${newUsername} added successfully!`);
    } catch (err) {
      setMessage(`Failed to add user: ${err.message}`);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await adminAPI.deleteUser(adminUsername, adminPassword, userToDelete);
      setMessage(`User ${userToDelete} deleted successfully!`);
    } catch (err) {
      setMessage(`Failed to delete user: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <div className="mb-4">
        <label>Admin Username</label>
        <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <div className="mb-4">
        <label>Admin Password</label>
        <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full border p-2 rounded" />
      </div>

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2">Add New User</h3>
      <div className="mb-2">
        <input type="text" placeholder="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div className="mb-4">
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <button onClick={handleAddUser} className="w-full bg-green-600 text-white p-2 rounded mb-6">Add User</button>

      <h3 className="text-xl font-semibold mb-2">Delete User</h3>
      <div className="mb-4">
        <input type="text" placeholder="Username to Delete" value={userToDelete} onChange={(e) => setUserToDelete(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <button onClick={handleDeleteUser} className="w-full bg-red-600 text-white p-2 rounded">Delete User</button>

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default AdminPanel;