import jwt
import os
from dotenv import load_dotenv

load_dotenv()
key =  os.getenv('JWT_SECRET') 

def sign_token(payload):
  return jwt.encode(payload, key, algorithm='HS256')

def verify_token(token):
  return jwt.decode(token, key, algorithms='HS256')