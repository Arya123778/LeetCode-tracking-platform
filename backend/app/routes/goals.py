from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Goal, Problem

goals_bp = Blueprint("goals", __name__)


def compute_progress(goal, user_id):
    query = Problem.query.filter_by(user_id=user_id, status="solved")
    if goal.difficulty:
        query = query.filter_by(difficulty=goal.difficulty)
    if goal.topic:
        query = query.filter_by(topic=goal.topic)
    query = query.filter(Problem.solved_at >= goal.created_at)
    return min(query.count(), goal.target_count)


@goals_bp.route("/", methods=["GET"])
@jwt_required()
def get_goals():
    user_id = int(get_jwt_identity())
    goals = Goal.query.filter_by(user_id=user_id, is_active=True).all()
    result = []
    for g in goals:
        d = g.to_dict()
        d["current_count"] = compute_progress(g, user_id)
        result.append(d)
    return jsonify(result), 200


@goals_bp.route("/", methods=["POST"])
@jwt_required()
def create_goal():
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data.get("title") or not data.get("target_count"):
        return jsonify({"error": "Title and target count are required"}), 400

    goal = Goal(
        user_id=user_id,
        title=data["title"],
        target_count=int(data["target_count"]),
        difficulty=data.get("difficulty"),
        topic=data.get("topic"),
        deadline=data.get("deadline"),
    )
    db.session.add(goal)
    db.session.commit()
    d = goal.to_dict()
    d["current_count"] = 0
    return jsonify(d), 201


@goals_bp.route("/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    user_id = int(get_jwt_identity())
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first_or_404()
    goal.is_active = False
    db.session.commit()
    return jsonify({"message": "Goal removed"}), 200