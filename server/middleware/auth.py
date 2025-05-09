from flask_jwt_extended import jwt_required, get_jwt, verify_jwt_in_request
from functools import wraps
from flask import jsonify, request

def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            # ✅ Allow CORS preflight requests to pass through
            if request.method == "OPTIONS":
                return '', 204

            verify_jwt_in_request()
            claims = get_jwt()
            print("JWT claims from request:", claims)  # ✅ Optional debugging
            role = claims.get("role", "").strip().lower()
            normalized_claim_role = role.replace(" ", "_")
            normalized_required = required_role.strip().lower().replace(" ", "_")

            if normalized_claim_role != normalized_required:
                return jsonify({"error": f"Unauthorized. Needed {normalized_required}, got {normalized_claim_role}"}), 403

            return f(*args, **kwargs)
        return wrapper
    return decorator
