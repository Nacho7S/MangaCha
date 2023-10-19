from setup.setupDb import recon
from psycopg2 import Error

sqlDropTable = f'DROP TABLE IF EXISTS "Favourites"'
sqlCreateFavouriteTables = f'CREATE TABLE IF NOT EXISTS "Favourites"("id" serial primary key, "userId" INT not null references "Users"("id") , "mangaId" varchar not null, "addedAt" timestamptz not null, unique("mangaId"))'

try:
  cursor = recon.cursor()
  # cursor.execute(sqlDropTable)
  # print("Favourites Table dropped successfully in PostgreSQL")
  cursor.execute(sqlCreateFavouriteTables)
  print("favourite Table has been created")
except (Exception, Error) as error:
  print(error)