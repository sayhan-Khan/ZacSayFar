import sqlite3
users_connnection = sqlite3.connect('main.db')
food_connnection = sqlite3.connect('food.db')
foodcursor = food_connnection.cursor()
users_cursor = users_connnection.cursor()

connection = sqlite3.connect('main.db')
cursor = connection.cursor()

cursor.execute('''create table if not exists foods(id Integer Primary Key Autoincrement,name text,calories int)''')

cursor.execute("""CREATE TABLE IF NOT EXISTS users (id integer Primary Key autoincrement,username text not null,password text not null)""")

users_cursor.execute("select * from users")
for row in users_cursor.fetchall():
    cursor.execute("insert or ignore into users (username, password) values (?,?)",(row[1],row[2]))

foodcursor.execute("select * from foods")
for row in foodcursor.fetchall():
    cursor.execute("insert or ignore into foods (name, calories) values (?,?)",(row[1],row[2]))


#connection.commit()
connection.close()
users_connnection.close()
food_connnection.close()
print("Done")


