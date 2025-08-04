# College Eats - Food Tracking Application

A comprehensive web application designed to help college students track their daily meals, monitor nutrition, and maintain healthy eating habits. Built with React and Flask, featuring a database of 214+ USDA-sourced foods.

## Features

### 🍽️ Meal Tracking
- **Add Meals**: Search and log meals from a comprehensive database of 214+ foods
- **Smart Search**: Real-time food search with calorie information
- **Quantity Control**: Flexible portion sizing for accurate tracking
- **Daily Overview**: View today's meals with total calorie count

### 📊 Nutrition Monitoring
- **Calorie Goals**: Set and track daily calorie targets (default: 2000 calories)
- **Progress Tracking**: Visual progress bars showing daily goal completion
- **Meal Statistics**: Average calories per meal and meal frequency
- **Weekly Goals**: Extended nutrition goal tracking

### 📱 User Experience
- **Clean Dashboard**: Professional interface with navigation cards
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure login and registration system
- **Multi-page Navigation**: Dedicated pages for different features

### 📈 Analytics & History
- **Meal History**: View past meals with filtering options (today/week/month)
- **Eating Patterns**: Track eating habits over time
- **Nutrition Stats**: Comprehensive nutrition goal tracking and progress visualization

## Technology Stack

### Frontend
- **React.js** - Modern JavaScript framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing for multi-page navigation
- **Tailwind CSS** - Utility-first CSS framework for responsive design

### Backend
- **Flask** - Python web framework
- **SQLite** - Lightweight database system
- **CORS** - Cross-origin resource sharing for API access
- **USDA Food Database** - 214+ foods with accurate nutritional information

## Getting Started

### Code and Packages
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

### Installation and Steps to Run:

1. **Clone the repository**
   ```bash
   git clone https://github.com/sayhan-Khan/ZacSayFar.git
   cd ZacSayFar
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up Python environment (optional but recommended)**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   python app.py
   ```
   The Flask server will start on `http://127.0.0.1:5000`

2. **Start the Frontend Development Server**
   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```
   The React app will start on `http://localhost:5177` (or next available port)

3. **Access the Application**
   Open your browser and navigate to the URL shown by Vite (typically `http://localhost:5177`)

### User Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Food & Meals
- `GET /foods` - Get all available foods (214+ items)
- `POST /api/add-meal` - Log a new meal
- `GET /api/user-meals` - Get user's meal history

## Database

### Food Database
Contains 214+ foods sourced from the USDA Food Data Central API, including:
- Common foods (fruits, vegetables, grains)
- Restaurant items
- Packaged foods
- Beverages

### User Database
Stores user accounts and meal logs with proper relational structure.

## Features in Detail

### Dashboard
- Welcome message with user's name
- Today's calorie progress with visual progress bar
- Quick stats: meals logged, average calories per meal
- Navigation cards for easy access to main features
- Recent meals preview with "Add Your First Meal" call-to-action

### Add Meal Page
- Search through 214+ foods in real-time
- Select food items with calorie information
- Adjust quantities for accurate tracking
- Instant meal preview before saving
- Success feedback after logging meals

### History Page
- View all logged meals organized by date
- Filter by time periods (today, week, month)
- Total calorie counts for each day
- Clean, organized meal history display

### Nutrition Page
- Set and track daily calorie goals
- Weekly nutrition goal tracking
- Progress visualization with charts
- Comprehensive nutrition statistics
