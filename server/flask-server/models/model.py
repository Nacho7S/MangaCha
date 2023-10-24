from migrations.createUserTables import recon
from models.user import Factory as Factory_User
from helper.hashPassword import hashPassword, verifyPassword
from psycopg2 import Error
import json
from datetime import date, datetime
today = date.today()
now = datetime.now()
currentDate = now.strftime("%d/%m/%Y %H:%M:%S")
cursor = recon.cursor()
class Model:
  @staticmethod
  def add_user(user):
    try:
      errorArr = []
      user_data = json.loads(user)
      print(user_data.keys(), "user data")
      print(len(user_data.keys()), "user data")
      if len(user_data.keys()) < 3 :
        user_data = json.loads(*user_data)
      print(user_data)
      email = user_data['email']
      if email == '':
         errorArr.append("email is Required")
      userName = user_data['userName']
      if userName == '' or userName == ' ':
        errorArr.append("username is Required")
      password = user_data['password']
      if password == '':
         errorArr.append('password is required')
      hashedPassword = hashPassword(password)
      profilePicture = user_data['profilePicture']
      description = user_data['description']
      if len(errorArr) > 0:
         raise Exception(errorArr)
      sqlInsertUserValue = f'INSERT INTO "Users"("userName", "email", "password", "profilePicture", "description") VALUES (%s, %s, %s, %s, %s) RETURNING *;'
      cursor.execute(sqlInsertUserValue, (userName, email, hashedPassword, profilePicture, description))
      data = cursor.fetchone()
      recon.commit()
      if data:
        print("Successfully added user:")
        print(data)
        return {"user":data}
      else:
        print("User not added.")
        return None
    except(Exception, Error) as error:
      print(error)
      return ({"Error":error})


  @staticmethod
  def login_user(login):
        try:
            user_login = json.loads(login)
            print(user_login)
            if len(user_login.keys()) < 2 :
              user_login = json.loads(*user_login)
            email = user_login['email']
            password = user_login['password']
            print(password, "ini password 37")
            sqlLoginUser = 'SELECT * FROM "Users" WHERE "email" = %s;'
            cursor.execute(sqlLoginUser, (email,))
            data = cursor.fetchone()
            print(data, "data logiin")
            if data:
                
                user = Factory_User.create_user(*data)
                verify = verifyPassword(password, user.password)
                print(verify)
                if verify:
                  print("Login successful:")
                  return user  
                else :
                  print("login invalid")
            else:
                print("Login failed: User not found.")
                return "notFound"
        except (Exception, Error) as error:
            print("Error:", error)
            return None
  
  @staticmethod
  def getCurrentUsers(email):
      try:
        sqlGetCurrentUser = 'SELECT * FROM "Users" WHERE "email" = %s'
        cursor.execute(sqlGetCurrentUser, (email,))
        data = cursor.fetchone()
        if data:
           user = Factory_User.create_user(*data)
          #  print(user)
           return user
      except (Exception, Error) as error:
        print("Error:", error)
        return None

  @staticmethod
  def addMangaFavourites(data, user):
    try:
      print("masuk")
      print(data, user)
      data_load = json.loads(data)
      print(len(data_load))
      print(*data_load)
      print ("mangaId" in data_load)
      mangaId = ''
      if "mangaId" in data_load:
        mangaId = data_load["mangaId"]
      else :
        mangaId = json.loads(*data_load)
      print(mangaId, user.id, currentDate)
      sqlQueries = f'INSERT INTO "Favourites"("userId", "mangaId", "addedAt") VALUES (%s, %s, %s) RETURNING *;'
      cursor.execute(sqlQueries,(user.id, mangaId, currentDate))
      dataFavourites = cursor.fetchone()
      recon.commit()
      if dataFavourites:
        print("successfully added to favourite list")
        return "success"
    except(Exception, Error) as error:
      print(error)
      if "duplicate key value violates unique constraint" in str(error):
            print("Duplicate key violation detected")
            return {"Error": "Duplicate Key"}
      return {"Error": str(error)}
    
  @staticmethod
  def removeMangaFromFavourites(data, user):
    try:
      data_load = json.loads(data)
      angaId = ''
      if "mangaId" in data_load:
        mangaId = data_load["mangaId"]
      else :
        mangaId = json.loads(*data_load)
      sqlDeleteFavourites = f'DELETE FROM "Favourites" WHERE ("userId"=%s AND "mangaId"=%s) Returning *'
      cursor.execute(sqlDeleteFavourites, (user.id, mangaId))
      data = cursor.fetchone()
      print(data)
      recon.commit()
      if data:
        return "Success"
      else:
         return {"Error": "No such key"}
    except(Exception, Error) as error:
      print(error)
      return ({"Error": error})
  
  @staticmethod
  def getAllFavouriteMangasByUserId(userId, limit, offset):
    try:
        sqlQuery = 'SELECT * FROM "Favourites" WHERE "userId" = %s ORDER BY "addedAt" DESC LIMIT %s OFFSET %s;'
        cursor.execute(sqlQuery, (userId, limit, offset))
        mangasList = []
        for row in cursor.fetchall():
            mangasList.append({"mangaId": row[2]})
        sqlTotalData = 'SELECT COUNT("userId") FROM "Favourites" WHERE "userId" = %s;'
        cursor.execute(sqlTotalData, (userId,))
        count = cursor.fetchone()[0]
        print (mangasList, count)
        return {"mangasList": mangasList, "totalData": count}

    except (Exception, Error) as e:
        print(e)
        return {"Error": str(e)}

    
  @staticmethod
  def isMangaInFavoriteList(userId, mangaId):
    try:
      sqlQuery = f'SELECT * FROM "Favourites" WHERE ("userId"=%s AND "mangaId"=%s)'
      cursor.execute(sqlQuery, (userId, mangaId))
      result = cursor.fetchone()
      print(result)
      if not result:
         return False
      else:
         return True
    except(Exception, Error) as e:
      print(e)
      return{"Error": e}
