from app.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__="users"
    id=db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(50), unique=True, nullable=False)
    email=db.Column(db.String(120), unique=True, nullable=False)
    password_hash=db.Column(db.String(128), nullable=False)
    leetcode_username=db.Column(db.String(50), nullable=True)
    created_at=db.Column(db.DateTime, default=datetime.utcnow)
    
    problems=db.relationship("Problem", backref="user", lazy=True, cascade="all, delete-orphan")
    goals=db.relationship("Goal", backref="user", lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "leetcode_username": self.leetcode_username,
            "created_at":self.created_at.isoformat(),
        }