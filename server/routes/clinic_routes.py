from flask import Blueprint, jsonify
from models import Clinic

clinic_bp = Blueprint('clinic', __name__)


@clinic_bp.route('/clinics', methods=['GET'])
def get_clinics():
    clinics = Clinic.query.all()
    return jsonify({"clinics": [
        {
            "id": c.id,
            "name": c.name,
            "location": c.location,
            "contact_info": c.contact_info,
            "country": getattr(c, "country", ""),       # Optional fallback
            "region": getattr(c, "region", ""),
            "specialty": getattr(c, "specialty", ""),
            "languages": getattr(c, "languages", []),
            "services": getattr(c, "services", []),
            "recommended": getattr(c, "recommended", False)
        } for c in clinics
    ]})
