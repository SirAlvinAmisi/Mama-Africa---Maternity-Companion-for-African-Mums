from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import BabyWeekUpdate, PregnancyDetail

baby_bp = Blueprint('baby', __name__)

@baby_bp.route('/baby/weekly-update', methods=['GET'])
@jwt_required()
def get_current_week_update():
    from datetime import datetime
    user_id = get_jwt_identity()
    pregnancy = PregnancyDetail.query.filter_by(user_id=user_id).first()
    if not pregnancy:
        return {"error": "No pregnancy data found"}, 404

    week = pregnancy.current_week
    update = BabyWeekUpdate.query.filter_by(week_number=week).first()
    if not update:
        return {"error": "No update available for this week"}, 404

    return jsonify({"week": week, "update": {
        "baby_size_analogy": update.baby_size_analogy,
        "development_note": update.development_note,
        "mama_tip": update.mama_tip,
        "proverb": update.proverb,
        "nutrition_tip": update.nutrition_tip,
        "midwife_question": update.midwife_question
    }})
