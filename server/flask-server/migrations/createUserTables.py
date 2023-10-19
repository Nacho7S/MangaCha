from setup.setupDb import recon
from psycopg2 import Error

sqlDropTable = f'DROP TABLE IF EXISTS "Users"'
sqlCreateUserTables = f'CREATE TABLE IF NOT EXISTS "Users"("id" serial primary key,"userName" varchar not null,"email" varchar not null,"password" varchar not null, "profilePicture" varchar, "description" text null)'

try:
  cursor = recon.cursor()
  # cursor.execute(sqlDropTable)
  # print("success to drop table")
  cursor.execute(sqlCreateUserTables)
  print("success to create user table")
except(Exception, Error) as error:
  print(error)
