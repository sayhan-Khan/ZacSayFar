import sqlite3

connection=sqlite3.connect('food.db')
cursor=connection.cursor()
cursor.execute("SELECT * FROM foods")

foods=cursor.fetchall()
for i in foods:
    print(i)

connection.close()
