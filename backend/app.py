#backend api, server for requests
#tools
from flask import Flask, jsonify
from flask_cors import CORS # acssess server
import sqlite3

app = Flask(__name__)
CORS(app)  # allow React frontend to access Flask backend
DATABASE = "/Users/sayhankhan/PycharmProjects/ZacSayFar/food.db"


#sql light connetction
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  #Collums by name
    return conn


#API route
@app.route('/foods', methods=['GET'])
def get_foods():
    conn = get_db_connection()
    cursor = conn.cursor()
    #select all
    cursor.execute('SELECT * FROM foods')
    rows = cursor.fetchall()
    conn.close()
    # Convert rows to directories
    foods = [dict(row) for row in rows]
    return jsonify(foods)

def register(username,password):
    connection = sqlite3.connect('users.db')
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
    connection = sqlite3.connect('users.db')
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
    connection=sqlite3.connect('users.db')
    cursor=connection.cursor()
    cursor.execute("select * from users where username = ? and password=?", (adminusername,adminpassword))
    if not cursor.fetchone():
        print("Admin authentication failed")
        connection.close()
        return
    cursor.execute("delete from users where username = ?", (user,))
    connection.commit()
    connection.close()
    print(f"User '{user}' deleted successfully")

#start server
if __name__ == '__main__':
    app.run(debug=True)