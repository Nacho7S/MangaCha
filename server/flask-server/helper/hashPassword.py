import bcrypt 
  
def hashPassword(plainPassword): 
  hash = bcrypt.hashpw((plainPassword).encode('utf-8'),bcrypt.gensalt())
  decodeHash = hash.decode("utf-8")
  return decodeHash
  
def verifyPassword(plainPassword , hashedPassword):
    return bcrypt.checkpw((plainPassword).encode('utf-8'), hashedPassword.encode("utf-8"))
  
