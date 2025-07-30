#testing food database
import sqlite3
from app import register,login,deleteuser, adminadduser, addtostorage, deletefromstorage, viewusertablestorage, viewallfood,viewallusers,viewallusers,getfoodbyusername


#testing user table
register("Bob","password")
register("Bob","password")
register("Zachery","password")
login("Bob","password")
login("fake","password")
deleteuser("admin","admin","Bob")
login("Bob","password")
adminadduser("admin","admin","Bob","password")
login("Bob","password")
deleteuser("admin","admin","Bosdfsdb")
adminadduser("admin","admin","Bob","password")
addtostorage("Bob","Broccoli, raw",95)
addtostorage("Bob","Broccoli, raw",95)
addtostorage("Bob","Yogurt, Greek, plain, nonfat",95)
deletefromstorage("Bob","Broccoli, raw",150)
deletefromstorage("Bob","Broccoli, raw",150)
addtostorage("Zachery","Broccoli, raw",95)
print()
viewusertablestorage()
print()
getfoodbyusername("Bob")
print()
getfoodbyusername("Zachery")
print()
deleteuser("admin","admin","Zachery")

#viewallfood()
viewusertablestorage()
