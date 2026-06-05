from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Problem
from app.services.analytics import (
    get_difficulty_breakdown,
    get_topic_breakdown,
    get_heatmap_data,
    get_streak_data,
    get_weekly_progress,
)

stats_bp = Blueprint("stats", __name__)


@stats_bp.route("/overview", methods=["GET"])
@jwt_required()
def overview():
    user_id = int(get_jwt_identity())
    problems = Problem.query.filter_by(user_id=user_id).all()

    total = len(problems)
    solved = sum(1 for p in problems if p.status == "solved")
    easy = sum(1 for p in problems if p.difficulty == "Easy")
    medium = sum(1 for p in problems if p.difficulty == "Medium")
    hard = sum(1 for p in problems if p.difficulty == "Hard")
    streak = get_streak_data(user_id)

    return jsonify({
        "total": total,
        "solved": solved,
        "easy": easy,
        "medium": medium,
        "hard": hard,
        "current_streak": streak["current"],
        "longest_streak": streak["longest"],
    }), 200


@stats_bp.route("/difficulty", methods=["GET"])
@jwt_required()
def difficulty():
    user_id = int(get_jwt_identity())
    return jsonify(get_difficulty_breakdown(user_id)), 200


@stats_bp.route("/topics", methods=["GET"])
@jwt_required()
def topics():
    user_id = int(get_jwt_identity())
    return jsonify(get_topic_breakdown(user_id)), 200


@stats_bp.route("/heatmap", methods=["GET"])
@jwt_required()
def heatmap():
    user_id = int(get_jwt_identity())
    return jsonify(get_heatmap_data(user_id)), 200


@stats_bp.route("/weekly", methods=["GET"])
@jwt_required()
def weekly():
    user_id = int(get_jwt_identity())
    return jsonify(get_weekly_progress(user_id)), 200