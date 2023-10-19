class User:
  def __init__(self, id, userName,email, password, profilePicture, description):
    self.id = id
    self.userName = userName
    self.email = email
    self.password = password
    self.profilePicture = profilePicture
    self.description = description


class Factory:
  @staticmethod
  def create_user(id, userName, email, password, profilePicture, description):
    return User(id, userName, email, password, profilePicture, description)
  

# user = Factory.create_user(1, "nacha", "nacha@gmail.com", "1234")

# print(user, "ini user")