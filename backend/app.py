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