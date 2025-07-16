import sqlite3

connection = sqlite3.connect('users.db')
cursor = connection.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS users (id integer Primary Key autoincrement,username text not null,password text not null)""")
#cursor.execute("insert into users (username, password) values (?,?)",("admin","admin"))

connection.commit()
connection.close()
