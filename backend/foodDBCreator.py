import requests
import sqlite3


page = 1
API_KEY = 'Ka0Xppa8HhoIHOiFvcobD4iFc4gvbeZDhTAO7lIg'
connection=sqlite3.connect('food.db')
cursor=connection.cursor()
cursor.execute('''create table if not exists foods(id Integer Primary Key Autoincrement,name text,calories int)''')
count=0
basicfood=[]
while len(basicfood) < 214:
    url = f'https://api.nal.usda.gov/fdc/v1/foods/search?api_key=Ka0Xppa8HhoIHOiFvcobD4iFc4gvbeZDhTAO7lIg&pageSize={page}&dataType=Foundation'
    response = requests.get(url)
    data = response.json()
    for food in data['foods']:
        foodname=food['description']

        calories=None
        for nutrients in food['foodNutrients']:
            if nutrients['nutrientName']=="Energy" and nutrients['unitName']=='KCAL':
                calories=nutrients['value']
                break
        if calories is not None:
            calories=int(calories)
            cursor.execute("insert into foods (name, calories) values (?, ?)",(foodname,calories))
            print(f"Food: {foodname},Calories: {calories}")
            basicfood.append(foodname)
            count+=1
            print(count)
        if len(basicfood)>=214:
            print("reached 214!")
            break

        page += 1
#connection.commit()
connection.close()
