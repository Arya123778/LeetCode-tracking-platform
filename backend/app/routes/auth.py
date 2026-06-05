from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db, bcrypt
from app.models import User

auth_bp=Blueprint('auth', __name__)
@auth_bp.route('/register', methods=['POST'])
def register():
    data=request.get_json()
    username=data.get('username')
    email=data.get('email')
    password=data.get('password')
    
    if not username or not email or not password:
        return jsonify({"error": "All fields are required."}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error":"Email already required."}), 409
    if User.query.filter_by(username=username).first():
        return jsonify({"error":"Username already required."}), 409
    hashed=bcrypt.generate_password_hash(password).decode("utf-8")
    user=User(username=username, email=email, password_hash=hashed)
    db.session.add(user)
    db.session.commit()
    
    token=create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user":user.to_dict()}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data=request.get_json()
    email=data.get("email").strip().lower()
    password=data.get("password", "")
    user=User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401
    token=create_access_token(identity=str(user.id))
    return jsonify({"token":token, "user": user.to_dict()}),200

@auth_bp.route("/me", methods=["GET"])
def me():
    user_id=int(get_jwt_identity())
    user=User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

@auth_bp.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id=int(get_jwt_identity())
    user=User.query.get_or_404(user_id)
    data=request.get_json()
    if "leetcode_username" in data:
        user.leetcode_username=data["username"]
    if "username" in data:
        user.username=data["username"]
        
    db.session.commit()
    return jsonify(user.to_dict()), 200