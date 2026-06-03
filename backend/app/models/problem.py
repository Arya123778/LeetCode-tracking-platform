from app.extensions import db
from datetime import datetime

class Problem(db.Model):
    __tablename__="problems"
    id=db.Column(db.Integer, primary_key=True)
    user_id=db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    title=db.Column(db.String(200), nullable=False)
    leetcode_number=db.Column(db.Integer, nullable=True)
    difficulty=db.Column(db.String(10), nullable=False)
    topic=db.Column(db.String(80), nullable=True)
    company=db.Column(db.String(80), nullable=True)
    url=db.Column(db.String(300), nullable=True)
    
    status=db.Column(db.String(20), default="solved") #solved, unsolved or in progress
    time_complexity=db.Column(db.String(50), nullable=True)
    space_complexity=db.Column(db.String(50), nullable=True)
    time_taken_mins=db.Column(db.Integer, nullable=True)
    attempts=db.Column(db.Integer, default=1)
    confidence=db.Column(db.Integer, default=4)
    
    notes=db.Column(db.Text, nullable=True)
    next_review_date=db.Column(db.DateTime, nullable=True)
    solved_at=db.Column(db.DateTime, nullable=True)
    updated_at=db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "title":self.title,
            "leetcode_number":self.leetcode_number,
            "difficulty":self.difficulty,
            "topic":self.topic,
            "company":self.company,
            "url":self.url,
            "status":self.status,
            "time_Complexity":self.time_complexity,
            "space_complexity":self.space_complexity,
            "time_taken_mins":self.time_taken_mins,
            "attempts":self.attempts,
            "confidence":self.confidence,
            "notes":self.notes,
            "next_review_date":self.next_review_date,
            "solved_at":self.solved_at,
            "updated_at":self.updated_at
        }
        