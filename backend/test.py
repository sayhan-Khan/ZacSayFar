#testing food database
import sqlite3
from app import register,login
from backend.app import deleteuser

connection=sqlite3.connect('food.db')
cursor=connection.cursor()
cursor.execute("SELECT * FROM foods")

foods=cursor.fetchall()
# for i in foods:
#     print(i)

connection.close()

#testing user table
register("Bob","password")
register("Bob","password")
register("Zachery","password")
login("Bob","password")
login("fake","password")
deleteuser("admin","admin","Bob")
login("Bob","password")

connection=sqlite3.connect('users.db')
cursor=connection.cursor()
cursor.execute("SELECT * FROM users")

users=cursor.fetchall()
# for u in users:
#     print(u)

connection.close()

