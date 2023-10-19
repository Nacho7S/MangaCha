import psycopg2
from psycopg2 import Error
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    con = psycopg2.connect(
    user="postgres",
    password="postgres",
    host="127.0.0.1",
    port="5432",
    database="postgres",
    )
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    print("success connect to postgres")

except (Exception, Error) as error :
    print("Error while connecting to PostgreSQL",error)


