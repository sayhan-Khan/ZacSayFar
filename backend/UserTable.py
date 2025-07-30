# import sqlite3
#
# connection = sqlite3.connect('main.db')
# cursor = connection.cursor()
# cursor.execute("PRAGMA foreign_keys=ON")
#
# cursor.execute("""CREATE TABLE IF NOT EXISTS users (id integer Primary Key autoincrement,username text not null,password text not null)""")
# cursor.execute("insert into users (username, password) values (?,?)",("admin","admin"))
#
# cursor.execute("drop table userfoodstorage")
# cursor.execute("""CREATE TABLE IF NOT EXISTS userfoodstorage (id integer Primary Key autoincrement,user_id integer,food_id integer,quantity integer default 1,
# foreign key (user_id) references users(id) on delete cascade, foreign key(food_id) references foods(id))""")
#
# cursor.execute('delete from users where id not in(select min(id) from users group by username)')
#
# # connection.commit()
# connection.close()
