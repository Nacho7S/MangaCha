from helper.jwt import verify_token
from functools import wraps
from flask import request, jsonify
from models.model import Model


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print(request.headers)
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"]
        if not token:
            return jsonify({"message": "Token Is Missing !!"}), 401

        try:
            data = verify_token(token)
            currentUser = Model.getCurrentUsers(data["email"])
            # print(currentUser)
            if currentUser == None:
                return jsonify({"message": "Invalid Authentication token!"}), 401
        except Exception as error:
            print(error)
        return f(currentUser, *args, **kwargs)

    return decorated
