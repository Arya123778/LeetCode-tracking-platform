from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Problem
from app.services.spaced_repetition import calculate_next_review

problems_bp=Blueprint("problems", __name__)

@problems_bp.route("/", methods=["GET"])
@jwt_required()
def get_problems():
    user_id=int(get_jwt_identity())
    difficulty=request.args.get("difficulty")
    topic=request.args.get("topic")
    status=request.args.get("status")
    company=request.args.get("company")
    search=request.args.get("search")
    
    query=Problem.query.filter_by(user_id=user_id)
    if difficulty:
        query=query.filter_by(difficulty=difficulty)
    if topic:
        query=query.filter_by(topic=topic)
    if status:
        query=query.filter_by(status=status)
    if company:
        query=query.filter_by(company=company)
    if search:
        query=query.filter(Problem.title.ilike(f"%{search}%"))
    problems=query.order_by(Problem.solved_at.desc()).all()
    return jsonify([p.to_dict() for p in problems]), 200

@problems_bp.route("/",methods=["POST"])
@jwt_required()
def add_problem():
    user_id=int(get_jwt_identity())
    data=request.get_json()
    
    if not data.get("title") or not data.get("difficulty"):
        return jsonify({"error": "Title and difficulty are required"}), 400
    problem = Problem(
        user_id=user_id,
        title=data["title"],
        leetcode_number=data.get("leetcode_number"),
        difficulty=data["difficulty"],
        topic=data.get("topic"),
        company=data.get("company"),
        url=data.get("url"),
        status=data.get("status", "solved"),
        time_complexity=data.get("time_complexity"),
        space_complexity=data.get("space_complexity"),
        time_taken_mins=data.get("time_taken_mins"),
        attempts=data.get("attempts", 1),
        confidence=data.get("confidence", 3),
        notes=data.get("notes"),
    )

    problem.next_review_date = calculate_next_review(data.get("confidence", 3))

    db.session.add(problem)
    db.session.commit()
    return jsonify(problem.to_dict()), 201


@problems_bp.route("/<int:problem_id>", methods=["PUT"])
@jwt_required()
def update_problem(problem_id):
    user_id = int(get_jwt_identity())
    problem = Problem.query.filter_by(id=problem_id, user_id=user_id).first_or_404()
    data = request.get_json()

    fields = [
        "title", "difficulty", "topic", "company", "url", "status",
        "time_complexity", "space_complexity", "time_taken_mins",
        "attempts", "confidence", "notes", "leetcode_number",
    ]
    for field in fields:
        if field in data:
            setattr(problem, field, data[field])

    if "confidence" in data:
        problem.next_review_date = calculate_next_review(data["confidence"])

    db.session.commit()
    return jsonify(problem.to_dict()), 200


@problems_bp.route("/<int:problem_id>", methods=["DELETE"])
@jwt_required()
def delete_problem(problem_id):
    user_id = int(get_jwt_identity())
    problem = Problem.query.filter_by(id=problem_id, user_id=user_id).first_or_404()
    db.session.delete(problem)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200


@problems_bp.route("/due-for-review", methods=["GET"])
@jwt_required()
def due_for_review():
    from datetime import datetime
    user_id = int(get_jwt_identity())
    problems = Problem.query.filter(
        Problem.user_id == user_id,
        Problem.next_review_date <= datetime.utcnow()
    ).all()
    return jsonify([p.to_dict() for p in problems]), 200