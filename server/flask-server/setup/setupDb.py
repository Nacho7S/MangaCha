from config.connectionDb import con
import psycopg2
from psycopg2 import Error
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    cursor = con.cursor()
    Database = "PythonAppDb"  # Camel case name
    sqlCreateDatabase = f'CREATE DATABASE "{Database}"'
    cursor.execute(sqlCreateDatabase)
    print(f"Success creating database: {Database}")
    
except (Exception, Error) as error:
    print(error)
finally:
    con.close()
    
    # Reconnect to PostgreSQL using the newly created database
    recon = psycopg2.connect(
        user="postgres",
        password="postgres",
        host="127.0.0.1",
        port="5432",
        database=Database,  # Use the camel case name here
    )
    recon.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    print(f"Success reconnecting to PostgreSQL to database: {Database}")
