"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

from flask_cors import CORS


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv('JWT_KEY')
jwt = JWTManager(app)

app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# ESTE ES EL ENDPOINT PARA REGISTRARSE Y CREAR USUARIOS, SE ACCEDE A EL DESDE EL REGISTER.JSX 
@app.route('/create_user', methods = ['POST'])
def create_user():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': 'Debes enviar informacion del usuario a registrar'}), 400
    if 'username' not in body:
        return jsonify({'msg': 'Debes enviar un username'})
    if 'password' not in body:
        return jsonify({'msg': 'Debes enviar un password'})
    
    new_user = User()
    new_user.email = body['username']
    new_user.password = body['password']
    new_user.is_active = True

    db.session.add(new_user)
    db.session.commit()
    return jsonify({'msg': 'ok', 'user': new_user.serialize()})

# ESTE ES EL ENDPOINT PARA HACER LOGIN E INGRESAR A INFORMACION PRIVADA, SE ACCEDE A EL DESDE EL HOME.JSX
@app.route('/login', methods = ['POST'])
def login():
    body = request.get_json(silent = True)
    if body is None:
        return jsonify({'msg': 'Debes enviar informacion en body'}), 400
    if 'email' not in body:
        return jsonify({'msg': 'el campo email es obligatorio'}), 400
    if 'password' not in body:
        return jsonify({'msg': ' el campo password es obligatorio'}), 400
    
    user = User.query.filter_by(email=body['email']).first()
    print(user)
    if user is None:
        return jsonify({'msg': 'El usuario o contraseña son incorrectos'}), 400
    if user.password != body['password']:
        return jsonify({'msg': 'El usuario o contraseña son incorrectos'}), 400

    access_token = create_access_token(identity=user.email)
    return jsonify({'msg': 'ok', 'token':access_token}), 200


@app.route('/my_username', methods = ['GET'])
@jwt_required()
def show_username():
    email_user_current = get_jwt_identity()
    print(email_user_current)
    user = User.query.filter_by(email=email_user_current).first()
    return jsonify({'msg':'ok', 'name': user.email})


@app.route('/my_password', methods = ['GET'])
@jwt_required()
def show_password():
    email_user_current = get_jwt_identity()
    print(email_user_current)
    user = User.query.filter_by(email=email_user_current).first()
    return jsonify({'msg':'ok', 'password': user.password})


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
