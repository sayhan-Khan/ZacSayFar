import { useState } from 'react';
import { Link } from 'react-router-dom';
import AddMeal from './AddMeal';
import UserMeals from './UserMeals';

function AddMealPage() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [refreshMeals, setRefreshMeals] = useState(0);

  const handleMealAdded = () => {
    setRefreshMeals(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-zinc-900 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-2xl font-bold text-white hover:text-emerald-400">
              College Eats
            </Link>
            <div className="flex gap-4">
              <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
              <Link to="/add-meal" className="text-emerald-400 font-medium">Add Meal</Link>
              <Link to="/history" className="text-gray-300 hover:text-white">History</Link>
              <Link to="/nutrition" className="text-gray-300 hover:text-white">Nutrition</Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.email || 'User'}</span>
            <Link to="/login" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500">
              Logout
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Meal</h2>
          <p className="text-gray-600">Search and log your meals from our database of 214+ foods</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Meal Form */}
          <div>
            <AddMeal 
              userEmail={user?.email} 
              onMealAdded={handleMealAdded}
            />
          </div>

          {/* Today's Meals */}
          <div>
            <UserMeals 
              userEmail={user?.email} 
              refreshTrigger={refreshMeals}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMealPage;
