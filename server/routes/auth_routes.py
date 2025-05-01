from flask import Blueprint, request, jsonify, current_app as app
from models import db, User, Profile
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        email = request.form['email']
        password = request.form['password']
        role = request.form['role']
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 400

        user = User(email=email, role=role)
        user.set_password(password)

        profile_data = {
            "full_name": f"{request.form.get('first_name', '')} {request.form.get('middle_name', '')} {request.form.get('last_name', '')}".strip(),
            "bio": request.form.get('bio', ''),
            "region": request.form.get('county')
        }
        if role == 'Health Professional' and 'license_number' in request.form:
            profile_data["license_number"] = request.form['license_number']
        user.profile = Profile(**profile_data)

        if 'avatar' in request.files:
            avatar = request.files['avatar']
            if avatar.filename:
                filename = secure_filename(avatar.filename)
                avatar_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                avatar.save(avatar_path)
                user.profile.profile_picture = f"/{avatar_path}"

        db.session.add(user)
        db.session.commit()

        return jsonify({"message": "User registered. Please check email to verify."}), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error.", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "Signup failed.", "details": str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            role_map = {
                "admin": "admin",
                "mom": "mum",
                "health professional": "health_pro"
            }
            token = create_access_token(
                identity=str(user.id),
                additional_claims={"role": role_map.get(user.role.lower(), user.role)}
            )
            return jsonify(access_token=token), 200
        return jsonify({"error": "Invalid credentials"}), 401

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database error during login", "details": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "Login failed", "details": str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "User not found"}), 404

    profile = user.profile
    return jsonify({
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "profile": {
            "full_name": profile.full_name if profile else None,
            "bio": profile.bio if profile else None,
            "region": profile.region if profile else None,
            "license_number": profile.license_number if profile else None,
            "profile_picture": profile.profile_picture if profile else None
        }
    })
