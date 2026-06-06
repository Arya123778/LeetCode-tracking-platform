
from datetime import datetime, timedelta

REVIEW_INTERVALS = {
    1: 1,    # very hard  → tomorrow
    2: 3,    # hard       → 3 days
    3: 7,    # okay       → 1 week
    4: 14,   # good       → 2 weeks
    5: 30,   # easy       → 1 month
}


def calculate_next_review(confidence: int) -> datetime:
    confidence = max(1, min(5, int(confidence)))
    days = REVIEW_INTERVALS[confidence]
    return datetime.utcnow() + timedelta(days=days)