import os
from setup.setupDb import recon
from dotenv import load_dotenv
from flask import Flask, request, jsonify, json
from models.model import Model
from helper.jwt import sign_token, verify_token
from flask_cors import CORS
from middleware.Authentication import token_required
import requests

app = Flask(__name__)
CORS(app)

load_dotenv()


@app.route("/")
def home():
    args = request.args
    searchQuery = args.get("search")
    page = args.get("page")
    maxContent = args.get("limit")
    yearRelease = args.get("year")
    print(page, "ini page")
    print(searchQuery, "ini query")
    title = "&"
    limit = 10
    offset = 0
    year = ""
    if searchQuery:
        title = f"&title={searchQuery}&"

    if yearRelease:
        year = f"year={yearRelease}&"

    if page != None:
        if int(page) > 0:
            offset = page

    if maxContent != None:
        limit = maxContent

    "https://api.mangadex.org/manga?limit=10&offset=0&title=horimiya&includedTagsMode=OR&excludedTagsMode=OR&status%5B%5D=ongoing&status%5B%5D=completed&status%5B%5D=hiatus&status%5B%5D=cancelled&publicationDemographic%5B%5D=shounen&publicationDemographic%5B%5D=shoujo&publicationDemographic%5B%5D=josei&publicationDemographic%5B%5D=seinen&publicationDemographic%5B%5D=none&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc&includes%5B%5D=cover_art&includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag"
    url = f"https://api.mangadex.org/manga?limit={limit}&offset={offset}{title}{year}includedTagsMode=OR&excludedTagsMode=OR&status%5B%5D=ongoing&status%5B%5D=completed&status%5B%5D=hiatus&status%5B%5D=cancelled&publicationDemographic%5B%5D=shounen&publicationDemographic%5B%5D=shoujo&publicationDemographic%5B%5D=josei&publicationDemographic%5B%5D=seinen&publicationDemographic%5B%5D=none&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc&includes%5B%5D=cover_art&includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag"
    print(url)

    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)
        else:
            return jsonify({"error": "request failed"}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route("/<mangaId>")
def manga(mangaId):
    print(mangaId)
    
    if "Authorization" in request.headers:
        # If "Authorization" is present in headers, apply token_required decorator
        @token_required
        def get_manga_details(currentUser, mangaId):
            url = f"https://api.mangadex.org/manga/{mangaId}/aggregate?translatedLanguage%5B%5D=en"
            urlDetails = f"https://api.mangadex.org/manga/{mangaId}?includes%5B%5D=manga&includes%5B%5D=cover_art&includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag&includes%5B%5D=creator"

            try:
                response = requests.get(url)
                responseDetails = requests.get(urlDetails)
                
                if response.status_code == 200 and responseDetails.status_code == 200:
                    data = response.json()
                    dataDetails = responseDetails.json()
                    # Check if manga is already in the user's favorite list
                    is_favorite = Model.isMangaInFavoriteList(currentUser.id, mangaId)
                    return jsonify({"mangaDetails": dataDetails, "chapters": data, "isFavorite": is_favorite})
            except requests.exceptions.RequestException as e:
                return jsonify({"error": str(e)}), 500

        # Call the decorated function
        return get_manga_details(mangaId)
    
    else:
        # If "Authorization" is not present, just fetch manga details without authentication
        url = f"https://api.mangadex.org/manga/{mangaId}/aggregate?translatedLanguage%5B%5D=en"
        urlDetails = f"https://api.mangadex.org/manga/{mangaId}?includes%5B%5D=manga&includes%5B%5D=cover_art&includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag&includes%5B%5D=creator"

        try:
            response = requests.get(url)
            responseDetails = requests.get(urlDetails)
            
            if response.status_code == 200 and responseDetails.status_code == 200:
                data = response.json()
                dataDetails = responseDetails.json()
                return jsonify({"mangaDetails": dataDetails, "chapters": data})
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500


@app.route("/chapter/<chapterId>")
def chapter(chapterId):
    print(f"/<chapterId> {chapterId}")
    imgUrl = f"https://api.mangadex.org/at-home/server/{chapterId}"
    chapterUrl = f"https://api.mangadex.org/chapter/{chapterId}"
    try:
        responseImg = requests.get(imgUrl)
        responseChapter = requests.get(chapterUrl)
        if responseImg.status_code == 200 and responseChapter.status_code == 200:
            dataImg = responseImg.json()
            dataChapter = responseChapter.json()
            return jsonify({"chapter": dataImg, "dataChapters": dataChapter})
        else:
            return jsonify({"error": "request failed"}), dataChapter.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500


@app.route("/register", methods=["POST"])
def register():
    print(request.headers["Content-Type"])
    if request.headers["Content-Type"] == "application/json":
        print(request.form)
        return "JSON Message: " + json.dumps(request.form)
    elif request.headers["Content-Type"] == "application/x-www-form-urlencoded":
        print(json.dumps(request.form), "ini responsenya harusnya")
        result = Model.add_user(json.dumps(request.form))
        print(result, "ini result")
        if "user" in result:
            print(result)
            return jsonify({"message": "success add user", "data": result["user"]}), 201
        elif "Error" in result:
            print(result["Error"], "masuk error")
            print("masuk sini")
            return (
                jsonify(
                    {"message": "failed to add user", "error": str(result["Error"])}
                ),
                400,
            )


@app.route("/login", methods=["POST"])
def login():
    print(request.headers["Content-Type"])
    if request.headers["Content-Type"] == "application/json":
        return "JSON Message: " + json.dumps(request.form)
    elif request.headers["Content-Type"] == "application/x-www-form-urlencoded":
        result = Model.login_user(json.dumps(request.form))
        print(result, "di main")
        if result == "notFound":
            return jsonify({"error": "user not found"}), 404
        else:
            token = sign_token({"email": result.email, "password": result.password})
            # print(token, "token biasa")
            return jsonify({"access_token": token})


@app.route("/user")
@token_required
def getCurrentUser(currentUser):
    id = currentUser.id
    username = currentUser.userName
    email = currentUser.email
    profilePicture = currentUser.profilePicture
    description = currentUser.description

    print(id, email, profilePicture, description)

    user_data = {
        "id": id,
        "username": username,     
        "email": email,
        "profilePicture": profilePicture,
        "description": description,
    }

    return jsonify({"message": "Success", "user": user_data}), 200


@app.route("/favourite", methods=["POST"])
@token_required
def addFavouriteManga(currentUser):
    if request.headers["Content-Type"] == "application/x-www-form-urlencoded":
        print(request.form)
        result = Model.addMangaFavourites(json.dumps(request.form), currentUser)
        if result == "success":
            return jsonify({"message": "successfully added favourite manga"}), 201
        elif "Error" in result:
            if "Duplicate Key" in str(result["Error"]):
                return (
                    jsonify({"message": "manga already exist on your favourite list"}),
                    409,
                )
            return jsonify({"message": "Failed to add favourite manga"}), 500


@app.route("/favourite", methods=["DELETE"])
@token_required
def removeFavouriteManga(currentUser):
    if request.headers["Content-Type"] == "application/x-www-form-urlencoded":
        print(request.form)
        result = Model.removeMangaFromFavourites(json.dumps(request.form), currentUser)
        if result == "Success":
            return (
                jsonify({"message": "successfully removed from favourite manga"}),
                200,
            )
        elif "Error" in result:
            if "No such key" in str(result["Error"]):
                return jsonify({"message": "manga is not in your favourite list"}), 404
            return jsonify({"message": "Failed to remove from favourite manga"}), 500


@app.route("/favourite", methods=["GET"])
@token_required
def getAllFavouriteMangas(currentUser):
    mangas = Model.getAllFavouriteMangasByUserId(currentUser.id)
    print(mangas, "ini manga")
    data = []

    for i in mangas:
        mangaId = i["mangaId"]
        urlDetails = f"https://api.mangadex.org/manga/{mangaId}?includes%5B%5D=manga&includes%5B%5D=cover_art&includes%5B%5D=author&includes%5B%5D=artist&includes%5B%5D=tag&includes%5B%5D=creator"

        try:
            responseDetails = requests.get(urlDetails)
            if responseDetails.status_code == 200:
                dataDetails = responseDetails.json()
                data.append(dataDetails)
        except requests.exceptions.RequestException as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"mangaList": data})


if __name__ == "__main__":
    app.run(debug=True)
