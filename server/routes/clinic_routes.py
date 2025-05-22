from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Clinic
from middleware.auth import role_required

clinic_bp = Blueprint('clinic_bp', __name__)

@clinic_bp.route('/clinics', methods=['GET'])
def get_clinics():
    clinics = Clinic.query.all()
    return jsonify(clinics=[c.to_dict() for c in clinics])

@clinic_bp.route('/clinics', methods=['POST'])
@jwt_required()
@role_required('health_pro')
def create_clinic():
    data = request.get_json()
    new_clinic = Clinic(
        name=data['name'],
        location=data['location'],
        country=data['country'],
        region=data['region'],
        specialty=data['specialty'],
        recommended=data.get('recommended', False),
        services=data.get('services', []),
        languages=data.get('languages', []),
        contact_info=data.get('contact_info', '')
    )
    db.session.add(new_clinic)
    db.session.commit()
    return jsonify(clinic=new_clinic.to_dict()), 201

@clinic_bp.route('/clinics/<int:clinic_id>/recommend', methods=['PATCH'])
@jwt_required()
@role_required('health_pro')
def toggle_clinic_recommendation(clinic_id):
    clinic = Clinic.query.get_or_404(clinic_id)
    clinic.recommended = not clinic.recommended
    db.session.commit()
    return jsonify(clinic=clinic.to_dict())
