from app.extensions import db
from datetime import datetime

class Goal(db.Model):
    __tablename__="goals"
    
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title=db.Column(db.String(200), nullable=False)
    target_count=db.Column(db.Integer, nullable=False)
    difficulty=db.Column(db.String(10), nullable=True)
    topic=db.Column(db.String(80), nullable=True)
    deadline=db.Column(db.DateTime, nullable=True)
    is_active=db.Column(db.Boolean, default=True)
    created_at=db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title":self.title,
            "target_count":self.target_count,
            "difficulty":self.difficulty,
            "topic":self.topic,
            "deadline":self.deadline,
            "is_active":self.is_active,
            "created_at":self.created_at.isoformat(),
        }