#backend api, server for requests
#tools
from flask import Flask, jsonify, request
from flask_cors import CORS # acssess server
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
DATABASE = "foodbackcall.db"  # Use local database file
MAIN_DATABASE = "main.db"     # User database


#sql light connection for food database
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  #Columns by name
    return conn

#sql light connection for user database
def get_main_db_connection():
    conn = sqlite3.connect(MAIN_DATABASE)
    conn.row_factory = sqlite3.Row  #Columns by name
    return conn


#API route
@app.route('/api/foods', methods=['GET'])
def get_foods():
    conn = get_db_connection()
    cursor = conn.cursor()
    #select all
    cursor.execute('SELECT * FROM foods')
    rows = cursor.fetchall()
    conn.close()
    #convert rows to directories
    foods = [dict(row) for row in rows]
    return jsonify(foods)

#this is the API endpoint for user registration
@app.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    email = data['email']
    password = data['password']
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    
    try:
        connection = sqlite3.connect('main.db')
        cursor = connection.cursor()
        
        #this checks if user already exists
        cursor.execute("SELECT * FROM users WHERE username = ?", (email,))
        if cursor.fetchone():
            connection.close()
            return jsonify({'error': 'User already exists'}), 409
        
        #making a new user
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (email, password))
        connection.commit()
        connection.close()
        
        return jsonify({'message': 'User registered successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': 'Registration failed'}), 500

# API Endpoint for admin
@app.route('/api/admin/add-user', methods=['POST'])
def api_admin_add_user():
    data = request.get_json()
    adminusername = data.get('adminUsername')
    adminpassword = data.get('adminPassword')
    newUsername = data.get('newUsername')
    newPassword = data.get('newPassword')
    if not adminusername.startswith("admin") or adminpassword != "admin":
        return jsonify({'error': 'Admin authentication failed'}), 403
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (newUsername,))
    if cursor.fetchone():
        connection.close()
        return jsonify({'error': 'Username already exists'}), 409
    cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (newUsername, newPassword))
    connection.commit()
    connection.close()
    return jsonify({'message': 'User added successfully'}), 201

# API Endpoint Admin Delete 
@app.route('/api/admin/delete-user', methods=['POST'])
def api_admin_delete_user():
    data = request.get_json()
    adminusername = data.get('adminUsername')
    adminpassword = data.get('adminPassword')
    userToDelete = data.get('userToDelete')
    if not adminusername.startswith("admin") or adminpassword != "admin":
        return jsonify({'error': 'Admin authentication failed'}), 403
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (userToDelete,))
    if not cursor.fetchone():
        connection.close()
        return jsonify({'error': 'User does not exist'}), 404
    cursor.execute("DELETE FROM users WHERE username = ?", (userToDelete,))
    connection.commit()
    connection.close()
    return jsonify({'message': f'User {userToDelete} deleted successfully'}), 200

#API endpoint for user login
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and password are required'}), 400
    
    email = data['email']
    password = data['password']
    
    try:
        connection = sqlite3.connect('main.db')
        cursor = connection.cursor()
        
        if email.startswith("admin") and password == "admin":
            return jsonify({'message': 'Admin login successful', 'user': {'email': email, 'isAdmin': True}}), 200

        cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (email, password))
        user = cursor.fetchone()

        connection.close()
        
        if user:
            return jsonify({'message': 'Login successful', 'user': {'email': email}}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
            return jsonify({'error': 'Login failed'}), 500

# API endpoint for adding food to user storage
@app.route('/api/add-meal', methods=['POST'])
def api_add_meal():
    data = request.get_json()

    if not data or 'email' not in data or 'foodName' not in data or 'quantity' not in data:
        return jsonify({'error': 'Email, food name, and quantity are required'}), 400

    email = data['email']
    food_name = data['foodName']
    quantity = data['quantity']

    try:
        conn = get_main_db_connection()
        cursor = conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")

        # Get User ID
        cursor.execute("SELECT id FROM users WHERE username = ?", (email,))
        user_row = cursor.fetchone()
        if not user_row:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        user_id = user_row['id']

        # Get Food ID
        cursor.execute("SELECT id FROM foods WHERE name = ?", (food_name,))
        food_row = cursor.fetchone()
        if not food_row:
            conn.close()
            return jsonify({'error': 'Food not found'}), 404
        food_id = food_row['id']

        # Check if entry exists in userfoodstorage
        cursor.execute("SELECT quantity FROM userfoodstorage WHERE user_id = ? AND food_id = ?", (user_id, food_id))
        existing = cursor.fetchone()

        if existing:
            # Update quantity
            new_quantity = existing['quantity'] + quantity
            cursor.execute("UPDATE userfoodstorage SET quantity = ? WHERE user_id = ? AND food_id = ?", (new_quantity, user_id, food_id))
        else:
            # Insert new record
            cursor.execute("INSERT INTO userfoodstorage (user_id, food_id, quantity) VALUES (?, ?, ?)", (user_id, food_id, quantity))

        conn.commit()
        conn.close()
        return jsonify({'message': 'Meal added successfully'}), 201

    except Exception as e:
        return jsonify({'error': f'Failed to add meal: {str(e)}'}), 500

# API endpoint for getting user meals
@app.route('/api/user-meals', methods=['GET'])
def api_get_user_meals():
    email = request.args.get('email')
    
    if not email:
        return jsonify({'error': 'Email parameter is required'}), 400
    
    try:
        connection = get_main_db_connection()
        cursor = connection.cursor()
        
        cursor.execute("""
            SELECT foods.name, foods.calories, userfoodstorage.quantity
            FROM userfoodstorage
            JOIN users on userfoodstorage.user_id = users.id
            JOIN foods on userfoodstorage.food_id = foods.id
            WHERE users.username = ?
        """, (email,))
        
        rows = cursor.fetchall()
        connection.close()
        
        meals = [dict(row) for row in rows]
        return jsonify(meals), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to get meals: {str(e)}'}), 500

def register(username,password):
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("select * from users where username = ?", (username,))
    if cursor.fetchone():
        print("Username already exists")
        connection.close()
        return
    cursor.execute("insert into users (username, password) values (?,?)", (username,password))
    connection.commit()
    connection.close()
    print("Registered successfully")

def login(username,password):
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("select * from users where username = ? and password=?", (username,password))
    if cursor.fetchone():
        print("Login Successful")
    else:
        print("Login Failed")
    connection.close()

def deleteuser(adminusername,adminpassword,user):
    if adminusername!="admin":
        print("Only admin can delete users")
        return
    connection=sqlite3.connect('main.db')
    cursor=connection.cursor()
    cursor.execute("select * from users where username = ? and password=?", (adminusername,adminpassword))
    if not cursor.fetchone():
        print("Admin authentication failed")
        connection.close()
        return

    cursor.execute("select * from users where username = ?", (user,))
    if not cursor.fetchone():
        print(f"User '{user}' does not exist")
        connection.close()
        return

    cursor.execute("delete from users where username = ?", (user,))
    connection.commit()
    connection.close()
    print(f"User '{user}' deleted successfully")

def adminadduser(adminusername,adminpassword,userN,userPW):
    if adminusername!="admin":
        print("Only admin can add users")
        return
    connection=sqlite3.connect('main.db')
    cursor=connection.cursor()
    cursor.execute("select * from users where username = ? and password=?", (adminusername,adminpassword))
    if not cursor.fetchone():
        print("Admin authentication failed")
        connection.close()
        return

    cursor.execute("select * from users where username = ?", (userN,))
    if cursor.fetchone():
        print("Username already exists")
        connection.close()
        return

    cursor.execute("insert into users (username,password) values(?, ?)", (userN,userPW))
    connection.commit()
    connection.close()
    print(f"User '{userN}' added successfully")

def addtostorage(username,foodname,quantity):
    connection=sqlite3.connect('main.db')
    cursor=connection.cursor()
    cursor.execute("pragma foreign_keys=ON")

    cursor.execute("select id from users where username = ?", (username,))
    user_row=cursor.fetchone()
    if not user_row:
        print("User not found, can not add to storage")
        connection.close()
        return
    userid=user_row[0]

    cursor.execute("select id from foods where name = ?", (foodname,))
    foodrow=cursor.fetchone()
    if not foodrow:
        print("Food not found, can not add to storage")
        connection.close()
        return
    foodid=foodrow[0]
    cursor.execute("""select quantity from userfoodstorage where user_id = ? and food_id = ?""",(userid,foodid))
    existing=cursor.fetchone()
    if existing:
        newquantity=quantity+existing[0]
        cursor.execute("""update userfoodstorage set quantity = ? where user_id = ? and food_id = ?""",(newquantity,userid,foodid))

    else:
        cursor.execute("insert into userfoodstorage  (user_id,food_id,quantity) values (?,?,?)",(userid,foodid,quantity))
    connection.commit()
    connection.close()

def deletefromstorage(username,foodname,quantity):
    connection=sqlite3.connect('main.db')
    cursor=connection.cursor()
    cursor.execute("pragma foreign_keys=ON")
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("pragma foreign_keys=ON")
    cursor.execute("select id from users where username = ?", (username,))
    user_row = cursor.fetchone()
    if not user_row:
        print("User not found,Can't delete from storage")
        connection.close()
        return
    userid = user_row[0]

    cursor.execute("select id from foods where name = ?", (foodname,))
    foodrow = cursor.fetchone()
    if not foodrow:
        print("Food not found, Can't delete from storage")
        connection.close()
        return
    foodid = foodrow[0]
    cursor.execute("Select quantity from userfoodstorage where user_id = ? and food_id = ?", (userid, foodid))
    existing = cursor.fetchone()
    if existing:
        if(quantity>existing[0]):
            print("Error trying to delete more than whats in the storage")
            connection.close()
            return
        newquantity=existing[0]-quantity
        if newquantity > 0:
            cursor.execute("""update userfoodstorage set quantity = ?where user_id = ?and food_id = ?""", (newquantity, userid, foodid))
        else:
            cursor.execute("delete from userfoodstorage where user_id=? and food_id=?",(userid,foodid)
    )
    connection.commit()
    connection.close()

def viewusertablestorage():
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("""Select users.username, foods.name,foods.calories,userfoodstorage.quantity
    from userfoodstorage
    join users on userfoodstorage.user_id = users.id
    join foods on userfoodstorage.food_id = foods.id""")

    userfoodstorage = cursor.fetchall()
    for u in userfoodstorage:
        print(u)
    connection.close()

def viewallfood():
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM foods")
    foods = cursor.fetchall()
    for i in foods:
        print(i)
    connection.close()

def viewallusers():
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    for i in users:
        print(i)
    connection.close()

def getfoodbyusername(username):
    connection = sqlite3.connect('main.db')
    cursor = connection.cursor()
    cursor.execute("""SELECT foods.name,foods.calories,userfoodstorage.quantity
                   from userfoodstorage
                   join users on userfoodstorage.user_id = users.id
                    join foods on userfoodstorage.food_id = foods.id
                   where users.username=?""", (username,))
    users = cursor.fetchall()
    for i in users:
        print(i)

#start server
if __name__ == '__main__':
    app.run(debug=True)