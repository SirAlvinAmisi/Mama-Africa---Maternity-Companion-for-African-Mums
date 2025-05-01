from flask import Blueprint, jsonify
from models import Clinic

clinic_bp = Blueprint('clinic', __name__)

@clinic_bp.route('/clinics')
def get_clinics():
    clinics = Clinic.query.all()
    return jsonify({"clinics": [
        {
            "id": c.id,
            "name": c.name,
            "location": c.location,
            "contact_info": c.contact_info
        } for c in clinics
    ]})